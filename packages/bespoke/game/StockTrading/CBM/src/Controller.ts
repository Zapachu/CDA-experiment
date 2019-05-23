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
    GameStage,
    ICreateParams,
    IGamePeriodState,
    IGameState,
    IMoveParams,
    IOrder,
    IPlayerState,
    IPushParams,
    ITrade,
    MATCH_TIME,
    MOCK,
    MoveType,
    PERIOD,
    PeriodStage,
    PushType,
    RobotCalcLog,
    RobotSubmitLog,
    ROLE,
    SheetType,
    ShoutResult,
    CONFIG
} from './config'
import {getEnumKeys} from './util'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    getGame4Player() {
        return {
            ...this.game,
            unitLists: []
        }
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        playerState.count = ~~((Math.random() + .5) * MOCK.count)
        playerState.point = ~~((Math.random() + .5) * MOCK.point)
        return playerState
    }

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.status = baseEnum.GameStatus.started
        gameState.stage = GameStage.matching
        gameState.playerIndex = 0
        gameState.periods = (Array(PERIOD).fill(null).map(() => ({
            stage: PeriodStage.reading,
            orders: [],
            buyOrderIds: [],
            sellOrderIds: [],
            trades: []
        } as IGamePeriodState)))
        gameState.periodIndex = 0
        return gameState
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor)
        switch (type) {
            case MoveType.getIndex: {
                if (playerState.playerIndex !== undefined) {
                    break
                }
                playerState.playerIndex = gameState.playerIndex++
                if (playerState.playerIndex > 0) {
                    break
                }
                let countDown = -MATCH_TIME
                const timer = global.setInterval(async () => {
                    if (gameState.status !== baseEnum.GameStatus.started) {
                        return
                    }
                    const {periodIndex} = gameState
                    const gamePeriodState = gameState.periods[periodIndex]
                    const {tradeTime, prepareTime, playerLimit} = CONFIG,
                        periodCountDown = countDown % (prepareTime + tradeTime + prepareTime)
                    switch (true) {
                        case countDown === 0: {
                            Array(playerLimit - gameState.playerIndex).fill(null).forEach(
                                async (_, i) => await this.startNewRobotScheduler(`$Robot_${i}`)
                            )
                            gameState.stage = GameStage.trading

                            break
                        }
                        case countDown > 0 : {
                            switch (periodCountDown) {
                                case prepareTime: {
                                    gamePeriodState.stage = PeriodStage.trading
                                    this.broadcast(PushType.beginTrading)
                                    break
                                }
                                case prepareTime + tradeTime: {
                                    gamePeriodState.stage = PeriodStage.result
                                    break
                                }
                                case 0: {
                                    if (gameState.periodIndex % PERIOD < PERIOD - 1) {
                                        gameState.periodIndex++
                                    } else {
                                        global.clearInterval(timer)
                                    }
                                    break
                                }
                            }
                        }
                    }
                    await this.stateManager.syncState()
                    this.broadcast(PushType.countDown, {countDown: countDown > 0 ? periodCountDown : countDown})
                    countDown++
                }, 1000)
                break
            }
            case MoveType.submitOrder: {
                const {periodIndex} = gameState,
                    gamePeriodState = gameState.periods[periodIndex]
                const {playerIndex} = playerState
                const {price, count} = params
                const orderDict = this.getOrderDict(gamePeriodState), {buyOrderIds, sellOrderIds} = gamePeriodState,
                    buyOrders = buyOrderIds.map(id => orderDict[id].price).join(','),
                    sellOrders = sellOrderIds.map(id => orderDict[id].price).join(',')
                let shoutResult: ShoutResult
                if (count <= 0 ||
                    (params.role === ROLE.Seller && count > playerState.count) ||
                    (params.role === ROLE.Buyer && count * price > playerState.point)
                ) {
                    Log.d('数量有误，无法继续报价')
                    shoutResult = ShoutResult.invalidCount
                } else {
                    const newOrder: IOrder = {
                        id: gamePeriodState.orders.length,
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
                const {periodIndex} = gameState
                await this.cancelOrder(periodIndex, playerState.playerIndex)
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
        const playerStates = await this.stateManager.getPlayerStates()
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
                    id: orders.length,
                    count: pairOrder.count - order.count
                }
                orders.push(subOrder)
                ;(order.role === ROLE.Buyer ? sellOrderIds : buyOrderIds).unshift(subOrder.id)
                trade.subOrderId = subOrder.id
            } else if (pairOrder.count < order.count) {
                trade.count = pairOrder.count
                const subOrder: IOrder = {
                    ...order,
                    id: orders.length,
                    count: order.count - pairOrder.count
                }
                trade.subOrderId = subOrder.id
                await this.shoutNewOrder(periodIndex, subOrder)
            }
            trades.push(trade)
            Object.values(playerStates).forEach(playerState => {
                let playerRole: ROLE
                if (order.playerIndex === playerState.playerIndex) {
                    playerRole = order.role
                }
                if (pairOrder.playerIndex === playerState.playerIndex) {
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
            this.broadcast(PushType.newTrade, {resOrderId: order.id})
            return ShoutResult.tradeSuccess
        } else {
            (order.role === ROLE.Seller ? sellOrderIds : buyOrderIds).unshift(order.id)
            this.broadcast(PushType.newOrder, {newOrderId: order.id})
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
}
