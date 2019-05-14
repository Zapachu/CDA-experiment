import {
    BaseController,
    baseEnum,
    FreeStyleModel,
    IActor,
    IMoveCallback,
    Log,
    TGameState,
    TPlayerState
} from 'bespoke-server'
import nodeXlsx from 'node-xlsx'
import {
    DBKey,
    FetchType,
    GroupType,
    MATCH_TIME,
    MoveType,
    PushType,
    RobotCalcLog,
    RobotSubmitLog,
    ROLE,
    SheetType,
    ShoutResult,
    Stage
} from './config'
import {
    GameGroupState,
    ICreateParams,
    IGameGroupState,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams
} from './interface'
import {getEnumKeys} from './util'
import {Actor} from "bespoke-common/build/baseEnum";

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    getGame4Player() {
        return {
            ...this.game,
            unitLists: []
        }
    }

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.groups = []
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        playerState.groups = []
        return playerState
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor)
        switch (type) {
            case MoveType.getGroup: {
                if (playerState.groupIndex !== undefined) {
                    break
                }
                let groupIndex = gameState.groups.findIndex(gameGroupState => {
                    if (gameGroupState.roleIndex >= this.game.params.roles.length) {
                        return false
                    }
                    if (actor.type === Actor.serverRobot) {
                        return true
                    }
                    return params.groupType === GroupType.Multi && gameGroupState.type === GroupType.Multi
                })
                if (groupIndex === -1) {
                    if (actor.type === Actor.serverRobot) {
                        break
                    }
                    gameState.groups.push({
                        orders: [],
                        stage: Stage.notStart,
                        orderId: 0,
                        buyOrderIds: [],
                        sellOrderIds: [],
                        trades: [],
                        roleIndex: 0,
                        positionUnitIndex: this.game.params.roles.map(() => 0),
                        type: params.groupType
                    })
                    groupIndex = gameState.groups.length - 1
                }
                const gameGroupState = gameState.groups[groupIndex],
                    roleIndex = gameGroupState.roleIndex++
                playerState.groups[groupIndex] = {
                    point: 0,
                    roleIndex,
                    unitList: this.game.params.unitLists[roleIndex]
                }
                playerState.groupIndex = groupIndex
                if (gameGroupState.stage === Stage.notStart) {
                    gameGroupState.stage = Stage.matching
                    let countDown = 0
                    const timer = global.setInterval(async () => {
                        if (gameState.status !== baseEnum.GameStatus.started) {
                            return
                        }
                        if (countDown === MATCH_TIME) {
                            gameGroupState.stage = Stage.reading
                            Array(this.game.params.roles.length - gameGroupState.roleIndex).fill(null).forEach(
                                async (_, i) => await this.startNewRobotScheduler(`${groupIndex}_${i}`)
                            )
                        }
                        const {tradeTime, prepareTime} = this.game.params
                        if (countDown === prepareTime + MATCH_TIME) {
                            gameGroupState.stage = Stage.trading
                            this.groupBroadcast(groupIndex, PushType.beginTrading)
                        }
                        if (countDown === prepareTime + tradeTime + MATCH_TIME) {
                            global.clearInterval(timer)
                            gameGroupState.stage = Stage.result
                            await this.calcProfit(groupIndex)
                        }
                        await this.stateManager.syncState()
                        this.groupBroadcast(groupIndex, PushType.countDown, {countDown: countDown++})
                    }, 1000)
                }
                break
            }
            case MoveType.leaveGroup:{
                playerState.groupIndex = undefined
                break
            }
            case MoveType.submitOrder: {
                const {groupIndex} = playerState,
                    playerGroupState = playerState.groups[groupIndex],
                    gameGroupState = gameState.groups[groupIndex]
                const {roleIndex} = playerGroupState
                const {price, unitIndex} = params
                const orderDict = this.getOrderDict(gameGroupState), {buyOrderIds, sellOrderIds} = gameGroupState,
                    buyOrders = buyOrderIds.map(id => orderDict[id].price).join(','),
                    sellOrders = sellOrderIds.map(id => orderDict[id].price).join(',')
                let shoutResult: ShoutResult
                if (unitIndex !== gameGroupState.positionUnitIndex[roleIndex]) {
                    Log.d('物品已成交，无法继续报价')
                    shoutResult = ShoutResult.shoutOnTradedUnit
                } else {
                    const newOrder = {
                        id: ++gameGroupState.orderId,
                        roleIndex,
                        unitIndex: gameGroupState.positionUnitIndex[roleIndex],
                        price
                    }
                    shoutResult = await this.shoutNewOrder(groupIndex, newOrder)
                }
                cb(shoutResult, buyOrders, sellOrders)
                break
            }
            case MoveType.cancelOrder: {
                const {groupIndex} = playerState
                await this.cancelOrder(groupIndex, playerState.groups[groupIndex].roleIndex)
                break
            }
        }
    }

    getOrderDict(gameState: IGameGroupState): { [id: number]: GameGroupState.IOrder } {
        const orderDict: { [id: number]: GameGroupState.IOrder } = {}
        gameState.orders.forEach(order => {
            orderDict[order.id] = order
        })
        return orderDict
    }

    async calcProfit(groupIndex: number) {
        const {game} = this,
            gameState = await this.stateManager.getGameState(),
            playerStates = await this.getGroupPlayerStates(groupIndex),
            {orders, trades} = gameState.groups[groupIndex]
        playerStates.forEach(playerState => {
            const playerGroupState = playerState.groups[groupIndex]
            const {roles} = game.params
            if (!playerGroupState.unitList) {
                return
            }
            let periodProfit = 0, tradedCount = 0
            const orderDict: { [id: number]: GameGroupState.IOrder } = {}
            orders.forEach(order => {
                orderDict[order.id] = order
            })
            trades.forEach(({reqId, resId}) => {
                const reqOrder = orderDict[reqId],
                    resOrder = orderDict[resId]
                let myOrder: GameGroupState.IOrder
                switch (playerGroupState.roleIndex) {
                    case reqOrder.roleIndex:
                        myOrder = reqOrder
                        break
                    case resOrder.roleIndex:
                        myOrder = resOrder
                        break
                    default:
                        return
                }
                const privateCost = +playerGroupState.unitList.split(' ')[myOrder.unitIndex]
                let unitProfit = roles[playerGroupState.roleIndex] === ROLE.Buyer ?
                    privateCost - reqOrder.price : reqOrder.price - privateCost
                periodProfit += unitProfit
                tradedCount++
            })
            playerGroupState.tradedCount = tradedCount
            playerGroupState.point = Number(periodProfit.toFixed(2))
        })
    }

    async shoutNewOrder(groupIndex: number, order: GameGroupState.IOrder): Promise<ShoutResult> {
        const role = this.game.params.roles[order.roleIndex]
        const {buyOrderIds, sellOrderIds, trades, positionUnitIndex, orders} = (await this.stateManager.getGameState()).groups[groupIndex]
        const marketRejected = role === ROLE.Seller ?
            sellOrderIds[0] && order.price >= orders.find(({id}) => id === sellOrderIds[0]).price :
            buyOrderIds[0] && order.price <= orders.find(({id}) => id === buyOrderIds[0]).price
        if (marketRejected) {
            return ShoutResult.marketReject
        } else {
            await this.cancelOrder(groupIndex, order.roleIndex)
            orders.push(order)
        }
        const tradeSuccess = role === ROLE.Seller ?
            buyOrderIds[0] && order.price <= orders.find(({id}) => id === buyOrderIds[0]).price :
            sellOrderIds[0] && order.price >= orders.find(({id}) => id === sellOrderIds[0]).price
        if (tradeSuccess) {
            const pairOrderId = role === ROLE.Seller ? buyOrderIds.shift() : sellOrderIds.shift()
            trades.push({
                reqId: pairOrderId,
                resId: order.id
            })
            positionUnitIndex[orders.find(({id}) => id === pairOrderId).roleIndex] += 1
            positionUnitIndex[order.roleIndex] += 1
            this.groupBroadcast(groupIndex, PushType.newTrade, {resOrderId: order.id})
            return ShoutResult.tradeSuccess
        } else {
            (role === ROLE.Seller ? sellOrderIds : buyOrderIds).unshift(order.id)
            this.groupBroadcast(groupIndex, PushType.newOrder, {newOrderId: order.id})
            return ShoutResult.shoutSuccess
        }
    }

    async cancelOrder(groupIndex: number, roleIndex: number) {
        const {buyOrderIds, sellOrderIds, orders} = (await this.stateManager.getGameState()).groups[groupIndex]
        for (let i = 0; i < buyOrderIds.length; i++) {
            if (orders.find(({id}) => id === buyOrderIds[i]).roleIndex === roleIndex) {
                return buyOrderIds.splice(i, 1)
            }
        }
        for (let i = 0; i < sellOrderIds.length; i++) {
            if (orders.find(({id}) => id === sellOrderIds[i]).roleIndex === roleIndex) {
                return sellOrderIds.splice(i, 1)
            }
        }
    }

    async handleFetch(req, res) {
        const {query: {type, sheetType}} = req
        switch (type) {
            case FetchType.exportXls: {
                if (req.user.id !== this.game.owner) {
                    return res.end('Invalid Request')
                }
                const name = SheetType[sheetType]
                let data = [], option = {}
                switch (sheetType) {
                    case SheetType.robotCalcLog: {
                        data.push(['seq', 'Subject', 'role', 'box', 'R', 'A', 'q', 'tau', 'beta', 'p', 'delta', 'r', 'LagGamma', 'Gamma', 'ValueCost', 'u', 'CalculatedPrice', 'Timestamp'])
                        const robotCalcLogs: Array<{ data: RobotCalcLog }> = await FreeStyleModel.find({
                            game: this.game.id,
                            key: DBKey.robotCalcLog
                        }) as any
                        robotCalcLogs.sort(({data: {seq: m}}, {data: {seq: n}}) => m - n)
                            .forEach(({data: {seq, playerSeq, role, unitIndex, R, A, q, tau, beta, p, delta, r, LagGamma, Gamma, ValueCost, u, CalculatedPrice, timestamp}}) =>
                                data.push([seq, playerSeq, role, unitIndex + 1, R, A, q, tau, beta, p, delta, r, LagGamma, Gamma, ValueCost, u, CalculatedPrice, timestamp]
                                    .map(v => typeof v === 'number' && v % 1 ? v.toFixed(2) : v)
                                ))
                        break
                    }
                    case SheetType.robotSubmitLog: {
                        data.push(['seq', 'Subject', 'role', 'box', 'ValueCost', 'Price', 'BuyOrders', 'SellOrders', `ShoutResult:${getEnumKeys(ShoutResult).join('/')}`, 'MarketBuyOrders', 'MarketSellOrders', 'Timestamp'])
                        const robotSubmitLogs: Array<{ data: RobotSubmitLog }> = await FreeStyleModel.find({
                            game: this.game.id,
                            key: DBKey.robotSubmitLog
                        }) as any
                        robotSubmitLogs.sort(({data: {seq: m}}, {data: {seq: n}}) => m - n)
                            .forEach(({data: {seq, playerSeq, role, unitIndex, ValueCost, price, buyOrders, sellOrders, shoutResult, marketBuyOrders, marketSellOrders, timestamp}}) =>
                                data.push([seq, playerSeq, role, unitIndex + 1, ValueCost, price, buyOrders, sellOrders, `${shoutResult + 1}:${ShoutResult[shoutResult]}`, marketBuyOrders, marketSellOrders, timestamp]
                                    .map(v => typeof v === 'number' && v % 1 ? v.toFixed(2) : v)
                                ))
                        break
                    }
                }
                let buffer = nodeXlsx.build([{name, data}], option)
                res.setHeader('Content-Type', 'application/vnd.openxmlformats')
                res.setHeader('Content-Disposition', 'attachment; filename=' + `${encodeURI(name)}.xlsx`)
                return res.end(buffer, 'binary')
            }
        }
    }

    async getGroupPlayerStates(groupIndex: number) {
        return Object.values(await this.stateManager.getPlayerStates()).filter(p => p.groupIndex === groupIndex)
    }

    groupBroadcast(groupIndex: number, type: PushType, params?: IPushParams) {
        this.getGroupPlayerStates(groupIndex).then(playerStates =>
            this.push(playerStates.map(({actor}) => actor), type, params)
        )
    }
}
