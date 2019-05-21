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
    PeriodType,
    ICreateParams,
    IGamePeriodState,
    IGameState,
    IMoveParams,
    IOrder,
    IPlayerPeriodState,
    IPlayerState,
    IPushParams,
    ITrade,
    MATCH_TIME,
    MOCK,
    MoveType,
    PushType,
    RobotCalcLog,
    RobotSubmitLog,
    ROLE,
    SheetType,
    ShoutResult,
    Stage
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
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        playerState.periods = []
        playerState.count = ~~((Math.random() + .5) * MOCK.count)
        playerState.point = ~~((Math.random() + .5) * MOCK.point)
        return playerState
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor)
        switch (type) {
            case MoveType.getPeriod: {
                if (playerState.periodIndex !== undefined) {
                    break
                }
                let periodIndex = gameState.periods.findIndex(gamePeriodState => {
                    if (gamePeriodState.playerIndex >= MOCK.playerLimit) {
                        return false
                    }
                    if (actor.type === baseEnum.Actor.serverRobot) {
                        return true
                    }
                    return params.periodType === PeriodType.Multi && gamePeriodState.type === PeriodType.Multi
                })
                if (periodIndex === -1) {
                    if (actor.type === baseEnum.Actor.serverRobot) {
                        break
                    }
                    gameState.periods.push({
                        orders: [],
                        stage: Stage.matching,
                        orderId: 0,
                        buyOrderIds: [],
                        sellOrderIds: [],
                        trades: [],
                        playerIndex: 0,
                        type: params.periodType,
                        marketPrice: MOCK.price
                    })
                    periodIndex = gameState.periods.length - 1
                }
                const gamePeriodState = gameState.periods[periodIndex],
                    playerIndex = gamePeriodState.playerIndex++
                playerState.periods[periodIndex] = {
                    playerIndex
                }
                playerState.periodIndex = periodIndex

                if (playerIndex > 0) {
                    break
                }
                let countDown = 1
                const timer = global.setInterval(async () => {
                    if (gameState.status !== baseEnum.GameStatus.started) {
                        return
                    }
                    if (countDown === MATCH_TIME) {
                        gamePeriodState.stage = Stage.reading
                        Array(MOCK.playerLimit - gamePeriodState.playerIndex).fill(null).forEach(
                            async (_, i) => await this.startNewRobotScheduler(`${periodIndex}_${i}`)
                        )
                    }
                    const {tradeTime, prepareTime} = this.game.params
                    if (countDown === prepareTime + MATCH_TIME) {
                        gamePeriodState.stage = Stage.trading
                        this.periodBroadcast(periodIndex, PushType.beginTrading)
                    }
                    if (countDown === prepareTime + tradeTime + MATCH_TIME) {
                        global.clearInterval(timer)
                        gamePeriodState.stage = Stage.result
                    }
                    await this.stateManager.syncState()
                    this.periodBroadcast(periodIndex, PushType.countDown, {countDown: countDown++})
                }, 1000)
                break
            }
            case MoveType.leavePeriod: {
                playerState.periodIndex = undefined
                break
            }
            case MoveType.setRole: {
                playerState.periods[playerState.periodIndex].role = params.role
                break
            }
            case MoveType.submitOrder: {
                const {periodIndex} = playerState,
                    playerPeriodState = playerState.periods[periodIndex],
                    gamePeriodState = gameState.periods[periodIndex]
                const {playerIndex} = playerPeriodState
                const {price, count} = params
                const orderDict = this.getOrderDict(gamePeriodState), {buyOrderIds, sellOrderIds} = gamePeriodState,
                    buyOrders = buyOrderIds.map(id => orderDict[id].price).join(','),
                    sellOrders = sellOrderIds.map(id => orderDict[id].price).join(',')
                let shoutResult: ShoutResult
                if (count <= 0 ||
                    (playerPeriodState.role === ROLE.Seller && count > playerState.count) ||
                    (playerPeriodState.role === ROLE.Buyer && count * gamePeriodState.marketPrice > playerState.point)
                ) {
                    Log.d('数量有误，无法继续报价')
                    shoutResult = ShoutResult.invalidCount
                } else {
                    const newOrder: IOrder = {
                        id: ++gamePeriodState.orderId,
                        playerIndex,
                        role: playerPeriodState.role,
                        price,
                        count
                    }
                    shoutResult = await this.shoutNewOrder(periodIndex, newOrder)
                }
                cb(shoutResult, buyOrders, sellOrders)
                break
            }
            case MoveType.cancelOrder: {
                const {periodIndex} = playerState
                await this.cancelOrder(periodIndex, playerState.periods[periodIndex].playerIndex)
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
                const {playerIndex, role}: IPlayerPeriodState = playerState.periods[periodIndex]
                if ([order.playerIndex, pairOrder.playerIndex].includes(playerIndex)) {
                    if (role === ROLE.Seller) {
                        playerState.count -= trade.count
                        playerState.point += trade.count * pairOrder.price
                    } else {
                        playerState.count += trade.count
                        playerState.point -= trade.count * pairOrder.price
                    }
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
        return Object.values(await this.stateManager.getPlayerStates()).filter(p => p.periodIndex === periodIndex)
    }

    periodBroadcast(periodIndex: number, type: PushType, params?: IPushParams) {
        this.getPeriodPlayerStates(periodIndex).then(playerStates =>
            this.push(playerStates.map(({actor}) => actor), type, params)
        )
    }
}
