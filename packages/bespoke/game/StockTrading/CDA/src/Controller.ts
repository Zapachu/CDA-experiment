import {
    BaseController,
    baseEnum,
    FreeStyleModel,
    IActor,
    IMoveCallback,
    TGameState,
    TPlayerState,
    Log
} from 'bespoke-server'
import nodeXlsx from 'node-xlsx'
import {
    DBKey,
    FetchType,
    Stage,
    MoveType,
    PushType,
    RobotCalcLog,
    RobotSubmitLog,
    ROLE,
    SheetType,
    ShoutResult
} from './config'
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import {getEnumKeys} from './util'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    private positionStack: {
        player: Array<number>
        robot: Array<number>
    }

    getGame4Player() {
        return {
            ...this.game,
            unitLists: []
        }
    }

    async init() {
        await super.init()
        const {roles} = this.game.params
        const player = [], robot = []
        roles.forEach((_, i) => player.push(i))
        this.positionStack = {player, robot}
        robot.forEach((_, i) => setTimeout(async () =>
            await this.startNewRobotScheduler(`Robot_${i}`, false), Math.random() * 3000))
        return this
    }

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        Object.assign(gameState, {
            orders: [],
            stage: Stage.matching,
            orderId: 0,
            buyOrderIds: [],
            sellOrderIds: [],
            trades: [],
            positionUnitIndex: this.game.params.roles.map(() => 0)
        } as IGameState)
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        playerState.point = 0
        return playerState
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor),
            {positionIndex} = playerState
        switch (type) {
            case MoveType.enterMarket: {
                if (playerState.positionIndex) {
                    break
                }
                const positionIndex = this.positionStack.player.shift()
                if (positionIndex === undefined) {
                    Log.d('角色已分配完')
                    break
                }
                playerState.positionIndex = positionIndex
                playerState.unitList = this.game.params.unitLists[positionIndex]
                break
            }
            case MoveType.openMarket: {
                let countDown = 0
                gameState.stage = Stage.prepare
                const timer = global.setInterval(async () => {
                    if (gameState.status !== baseEnum.GameStatus.started) {
                        return
                    }
                    const {tradeTime, prepareTime} = this.game.params
                    if (countDown === +prepareTime) {
                        gameState.stage = Stage.trading
                        this.broadcast(PushType.beginTrading)
                    }
                    if (countDown === tradeTime + prepareTime) {
                        gameState.stage = Stage.result
                        await this.calcProfit()
                    }
                    if (countDown === tradeTime + 2 * prepareTime) {
                        global.clearInterval(timer)
                        gameState.stage = Stage.leave
                    }
                    await this.stateManager.syncState()
                    this.broadcast(PushType.countDown, {countDown: countDown++})
                }, 1000)
                break
            }
            case MoveType.submitOrder: {
                const {price, unitIndex} = params
                const orderDict = this.getOrderDict(gameState), {buyOrderIds, sellOrderIds} = gameState,
                    buyOrders = buyOrderIds.map(id => orderDict[id].price).join(','),
                    sellOrders = sellOrderIds.map(id => orderDict[id].price).join(',')
                let shoutResult: ShoutResult
                if (unitIndex !== gameState.positionUnitIndex[positionIndex]) {
                    Log.d('物品已成交，无法继续报价')
                    shoutResult = ShoutResult.shoutOnTradedUnit
                } else {
                    const newOrder = {
                        id: ++gameState.orderId,
                        positionIndex,
                        unitIndex: gameState.positionUnitIndex[positionIndex],
                        price
                    }
                    shoutResult = await this.shoutNewOrder(newOrder)
                }
                cb(shoutResult, buyOrders, sellOrders)
                break
            }
            case MoveType.cancelOrder: {
                await this.cancelOrder(positionIndex)
                break
            }
        }
    }

    getOrderDict(gameState: IGameState): { [id: number]: GameState.IOrder } {
        const orderDict: { [id: number]: GameState.IOrder } = {}
        gameState.orders.forEach(order => {
            orderDict[order.id] = order
        })
        return orderDict
    }

    async calcProfit() {
        const {game} = this,
            gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates(),
            {orders, trades} = gameState
        for (let userId in playerStates) {
            const playerState = playerStates[userId]
            const {roles} = game.params
            if (!playerState.unitList) {
                continue
            }
            let periodProfit = 0, tradedCount = 0
            const orderDict: { [id: number]: GameState.IOrder } = {}
            orders.forEach(order => {
                orderDict[order.id] = order
            })
            trades.forEach(({reqId, resId}) => {
                const reqOrder = orderDict[reqId],
                    resOrder = orderDict[resId]
                let myOrder: GameState.IOrder
                switch (playerState.positionIndex) {
                    case reqOrder.positionIndex:
                        myOrder = reqOrder
                        break
                    case resOrder.positionIndex:
                        myOrder = resOrder
                        break
                    default:
                        return
                }
                const privateCost = +playerState.unitList.split(' ')[myOrder.unitIndex]
                let unitProfit = roles[playerState.positionIndex] === ROLE.Buyer ?
                    privateCost - reqOrder.price : reqOrder.price - privateCost
                periodProfit += unitProfit
                tradedCount++
            })
            playerState.tradedCount = tradedCount
            playerState.point = Number(periodProfit.toFixed(2))
        }
    }

    async shoutNewOrder(order: GameState.IOrder): Promise<ShoutResult> {
        const role = this.game.params.roles[order.positionIndex]
        const {buyOrderIds, sellOrderIds, trades, positionUnitIndex, orders} = await this.stateManager.getGameState()
        const marketRejected = role === ROLE.Seller ?
            sellOrderIds[0] && order.price >= orders.find(({id}) => id === sellOrderIds[0]).price :
            buyOrderIds[0] && order.price <= orders.find(({id}) => id === buyOrderIds[0]).price
        if (marketRejected) {
            return ShoutResult.marketReject
        } else {
            await this.cancelOrder(order.positionIndex)
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
            positionUnitIndex[orders.find(({id}) => id === pairOrderId).positionIndex] += 1
            positionUnitIndex[order.positionIndex] += 1
            this.broadcast(PushType.newTrade, {resOrderId: order.id})
            return ShoutResult.tradeSuccess
        } else {
            (role === ROLE.Seller ? sellOrderIds : buyOrderIds).unshift(order.id)
            this.broadcast(PushType.newOrder, {newOrderId: order.id})
            return ShoutResult.shoutSuccess
        }
    }

    async cancelOrder(positionIndex: number) {
        const {buyOrderIds, sellOrderIds, orders} = await this.stateManager.getGameState()
        for (let i = 0; i < buyOrderIds.length; i++) {
            if (orders.find(({id}) => id === buyOrderIds[i]).positionIndex === positionIndex) {
                return buyOrderIds.splice(i, 1)
            }
        }
        for (let i = 0; i < sellOrderIds.length; i++) {
            if (orders.find(({id}) => id === sellOrderIds[i]).positionIndex === positionIndex) {
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
}
