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
    ICreateParams,
    IGamePeriodState,
    IGameState,
    IMoveParams,
    IOrder,
    IPlayerState,
    IPushParams,
    ITrade, MATCH_TIME,
    MOCK,
    MoveType,
    PushType,
    RobotCalcLog,
    RobotSubmitLog,
    ROLE,
    SheetType,
    ShoutResult,
    Stage,
    PERIOD
} from './config'
import {getEnumKeys} from './util'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    getGame4Player() {
        return {
            ...this.game,
            unitLists: []
        }
    }

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.status = baseEnum.GameStatus.started
        gameState.periods = []
        gameState.groups = []
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        playerState.groups = []
        playerState.count = ~~((Math.random() + .5) * MOCK.count)
        playerState.point = ~~((Math.random() + .5) * MOCK.point)
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
                    if (gameGroupState.playerIndex >= MOCK.playerLimit) {
                        return false
                    }
                    if (actor.type === baseEnum.Actor.serverRobot) {
                        return true
                    }
                    return params.groupType === GroupType.Multi && gameGroupState.type === GroupType.Multi
                })
                if (groupIndex === -1) {
                    if (actor.type === baseEnum.Actor.serverRobot) {
                        break
                    }
                    gameState.groups.push({
                        type: params.groupType,
                        playerIndex: 0,
                        periodIndex: gameState.periods.length
                    })
                    gameState.periods.push(...(Array(PERIOD).fill(null).map(() => ({
                        orders: [],
                        stage: Stage.matching,
                        orderId: 0,
                        buyOrderIds: [],
                        sellOrderIds: [],
                        trades: [],
                        playerIndex: 0,
                        type: params.groupType,
                        marketPrice: MOCK.price
                    }))))
                    groupIndex = gameState.groups.length - 1
                }
                const gameGroupState = gameState.groups[groupIndex],
                    playerIndex = gameGroupState.playerIndex++
                playerState.groups[groupIndex] = {playerIndex}
                playerState.groupIndex = groupIndex
                if (playerIndex > 0) {
                    break
                }
                let countDown = 1
                const timer = global.setInterval(async () => {
                    if (gameState.status !== baseEnum.GameStatus.started) {
                        return
                    }
                    if (countDown === MATCH_TIME) {
                        Array(MOCK.playerLimit - gameGroupState.playerIndex).fill(null).forEach(
                            async (_, i) => await this.startNewRobotScheduler(`${groupIndex}_${i}`)
                        )
                    }
                    const {tradeTime, prepareTime} = this.game.params,
                        periodCountDown = countDown % (prepareTime + tradeTime + MATCH_TIME)
                    const {periodIndex} = gameGroupState
                    const gamePeriodState = gameState.periods[periodIndex]
                    if (periodCountDown === MATCH_TIME) {
                        gamePeriodState.stage = Stage.reading
                    }
                    if (periodCountDown === prepareTime + MATCH_TIME) {
                        gamePeriodState.stage = Stage.trading
                        this.periodBroadcast(periodIndex, PushType.beginTrading)
                    }
                    if (periodCountDown === 0) {
                        gamePeriodState.stage = Stage.result
                        if (gameGroupState.periodIndex < PERIOD - 1) {
                            gameGroupState.periodIndex++
                        } else {
                            global.clearInterval(timer)
                        }
                    }
                    await this.stateManager.syncState()
                    this.periodBroadcast(periodIndex, PushType.countDown, {countDown: periodCountDown})
                    countDown++
                }, 1000)
                break
            }
            case MoveType.leaveGroup: {
                playerState.groupIndex = undefined
                break
            }
            case MoveType.submitOrder: {
                const {groupIndex} = playerState,
                    playerGroupState = playerState.groups[groupIndex],
                    gameGroupState = gameState.groups[groupIndex],
                    {periodIndex} = gameGroupState,
                    gamePeriodState = gameState.periods[periodIndex]
                const {playerIndex} = playerGroupState
                const {price, count} = params
                const orderDict = this.getOrderDict(gamePeriodState), {buyOrderIds, sellOrderIds} = gamePeriodState,
                    buyOrders = buyOrderIds.map(id => orderDict[id].price).join(','),
                    sellOrders = sellOrderIds.map(id => orderDict[id].price).join(',')
                let shoutResult: ShoutResult
                if (count <= 0 ||
                    (params.role === ROLE.Seller && count > playerState.count) ||
                    (params.role === ROLE.Buyer && count * gamePeriodState.marketPrice > playerState.point)
                ) {
                    Log.d('数量有误，无法继续报价')
                    shoutResult = ShoutResult.invalidCount
                } else {
                    const newOrder: IOrder = {
                        id: ++gamePeriodState.orderId,
                        playerIndex,
                        role: params.role,
                        price,
                        count
                    }
                    shoutResult = await this.shoutNewOrder(periodIndex, newOrder)
                }
                cb(shoutResult, buyOrders, sellOrders)
                break
            }
            case MoveType.cancelOrder: {
                const {groupIndex} = playerState,
                    gameGroupState = gameState.groups[groupIndex],
                    {periodIndex} = gameGroupState
                await this.cancelOrder(periodIndex, playerState.groups[groupIndex].playerIndex)
                break
            }
        }
    }

    getOrderDict(gameState: IGamePeriodState): { [id: number]: IOrder } {
        const orderDict: { [id: number]: IOrder } = {}
        gameState.orders.forEach(order => {
            orderDict[order.id] = order
        })
        return orderDict
    }

    async shoutNewOrder(periodIndex: number, order: IOrder): Promise<ShoutResult> {
        const periodPlayerStates = await this.getPeriodPlayerStates(periodIndex)
        const gamePeriodState = (await this.stateManager.getGameState()).periods[periodIndex],
            {buyOrderIds, sellOrderIds, trades, orders} = gamePeriodState
        const marketRejected = order.role === ROLE.Seller ?
            sellOrderIds[0] && order.price > orders.find(({id}) => id === sellOrderIds[0]).price :
            buyOrderIds[0] && order.price < orders.find(({id}) => id === buyOrderIds[0]).price
        if (marketRejected) {
            return ShoutResult.marketReject
        } else {
            await this.cancelOrder(periodIndex, order.playerIndex)
            orders.push(order)
        }
        const tradeSuccess = order.role === ROLE.Seller ?
            buyOrderIds[0] && order.price <= orders.find(({id}) => id === buyOrderIds[0]).price :
            sellOrderIds[0] && order.price >= orders.find(({id}) => id === sellOrderIds[0]).price
        if (tradeSuccess) {
            const pairOrderId = order.role === ROLE.Seller ? buyOrderIds.shift() : sellOrderIds.shift(),
                pairOrder = orders.find(({id}) => id === pairOrderId),
                trade: ITrade = {
                    reqOrderId: pairOrderId,
                    resOrderId: order.id,
                    count: order.count
                }
            if (pairOrder.count > order.count) {
                const subOrder: IOrder = {
                    ...pairOrder,
                    id: ++gamePeriodState.orderId,
                    count: pairOrder.count - order.count
                }
                orders.push(subOrder)
                ;(order.role === ROLE.Buyer ? sellOrderIds : buyOrderIds).unshift(subOrder.id)
                trade.subOrderId = subOrder.id
            } else if (pairOrder.count < order.count) {
                trade.count = pairOrder.count
                const subOrder: IOrder = {
                    ...order,
                    id: ++gamePeriodState.orderId,
                    count: order.count - pairOrder.count
                }
                trade.subOrderId = subOrder.id
                await this.shoutNewOrder(periodIndex, subOrder)
            }
            trades.push(trade)
            periodPlayerStates.forEach(playerState => {
                const {playerIndex} = playerState.groups[playerState.groupIndex]
                let playerRole: ROLE
                if (order.playerIndex === playerIndex) {
                    playerRole = order.role
                }
                if (pairOrder.playerIndex === playerIndex) {
                    playerRole = order.role
                }
                if (playerRole === undefined) {
                    return
                }
                if (playerRole === ROLE.Seller) {
                    playerState.count -= trade.count
                    playerState.point += trade.count * pairOrder.price
                } else {
                    playerState.count += trade.count
                    playerState.point -= trade.count * pairOrder.price
                }
            })
            gamePeriodState.marketPrice = pairOrder.price
            this.periodBroadcast(periodIndex, PushType.newTrade, {resOrderId: order.id})
            return ShoutResult.tradeSuccess
        } else {
            (order.role === ROLE.Seller ? sellOrderIds : buyOrderIds).unshift(order.id)
            this.periodBroadcast(periodIndex, PushType.newOrder, {newOrderId: order.id})
            return ShoutResult.shoutSuccess
        }
    }

    async cancelOrder(periodIndex: number, playerIndex: number) {
        const {buyOrderIds, sellOrderIds, orders} = (await this.stateManager.getGameState()).periods[periodIndex]
        for (let i = 0; i < buyOrderIds.length; i++) {
            if (orders.find(({id}) => id === buyOrderIds[i]).playerIndex === playerIndex) {
                return buyOrderIds.splice(i, 1)
            }
        }
        for (let i = 0; i < sellOrderIds.length; i++) {
            if (orders.find(({id}) => id === sellOrderIds[i]).playerIndex === playerIndex) {
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
                        data.push(['seq', 'Subject', 'role', 'R', 'A', 'q', 'tau', 'beta', 'p', 'delta', 'r', 'LagGamma', 'Gamma', 'ValueCost', 'u', 'CalculatedPrice', 'Timestamp'])
                        const robotCalcLogs: Array<{ data: RobotCalcLog }> = await FreeStyleModel.find({
                            game: this.game.id,
                            key: DBKey.robotCalcLog
                        }) as any
                        robotCalcLogs.sort(({data: {seq: m}}, {data: {seq: n}}) => m - n)
                            .forEach(({data: {seq, playerSeq, role, R, A, q, tau, beta, p, delta, r, LagGamma, Gamma, ValueCost, u, CalculatedPrice, timestamp}}) =>
                                data.push([seq, playerSeq, role + 1, R, A, q, tau, beta, p, delta, r, LagGamma, Gamma, ValueCost, u, CalculatedPrice, timestamp]
                                    .map(v => typeof v === 'number' && v % 1 ? v.toFixed(2) : v)
                                ))
                        break
                    }
                    case SheetType.robotSubmitLog: {
                        data.push(['seq', 'Subject', 'role', 'ValueCost', 'Price', 'BuyOrders', 'SellOrders', `ShoutResult:${getEnumKeys(ShoutResult).join('/')}`, 'MarketBuyOrders', 'MarketSellOrders', 'Timestamp'])
                        const robotSubmitLogs: Array<{ data: RobotSubmitLog }> = await FreeStyleModel.find({
                            game: this.game.id,
                            key: DBKey.robotSubmitLog
                        }) as any
                        robotSubmitLogs.sort(({data: {seq: m}}, {data: {seq: n}}) => m - n)
                            .forEach(({data: {seq, playerSeq, role, ValueCost, price, buyOrders, sellOrders, shoutResult, marketBuyOrders, marketSellOrders, timestamp}}) =>
                                data.push([seq, playerSeq, role, ValueCost, price, buyOrders, sellOrders, `${shoutResult + 1}:${ShoutResult[shoutResult]}`, marketBuyOrders, marketSellOrders, timestamp]
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

    async getPeriodPlayerStates(periodIndex: number) {
        const {groups} = await this.stateManager.getGameState()
        const groupIndex = groups.findIndex(g => g.periodIndex === periodIndex)
        return Object.values(await this.stateManager.getPlayerStates()).filter(p => p.groupIndex === groupIndex)
    }

    periodBroadcast(periodIndex: number, type: PushType, params?: IPushParams) {
        this.getPeriodPlayerStates(periodIndex).then(playerStates =>
            this.push(playerStates.map(({actor}) => actor), type, params)
        )
    }
}
