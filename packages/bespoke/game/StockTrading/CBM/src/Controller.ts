import {
    BaseController,
    baseEnum,
    IActor,
    IMoveCallback,
    Log,
    TGameState,
    TPlayerState,
    RedisCall,
    gameId2PlayUrl
} from 'bespoke-server'
import {
    CONFIG,
    FetchType,
    GameType,
    ICreateParams,
    IGamePeriodState,
    IGameState,
    IMoveParams,
    IOrder,
    IPlayerState,
    IPushParams,
    ITrade,
    MoveType,
    PERIOD,
    PeriodStage,
    PushType,
    ROLE,
    PrivatePriceRegion, namespace
} from './config'
import {CreateGame, PhaseDone} from '../../protocol'
import {getBalanceIndex, getEnumKeys, random} from './util'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.status = baseEnum.GameStatus.started
        gameState.type = ~~(Math.random() * getEnumKeys(GameType).length)
        gameState.playerIndex = 0
        gameState.periods = (Array(PERIOD).fill(null).map(() => ({
            stage: PeriodStage.reading,
            orders: [],
            buyOrderIds: [],
            sellOrderIds: [],
            trades: [],
            closingPrice: 50
        } as IGamePeriodState)))
        gameState.periodIndex = 0
        gameState.initialAsset = {
            count: 100 + ~~(Math.random() * 50),
            point: 3e4 + ~~(Math.random() * 1e4)
        }
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        const {initialAsset: {point, count}, type} = await this.stateManager.getGameState()
        playerState.count = count
        playerState.point = point
        const [[min, max]] = PrivatePriceRegion[type]
        playerState.privatePrices = [random(min, max)]
        return playerState
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
                let countDown = 1
                const timer = global.setInterval(async () => {
                    if (gameState.status !== baseEnum.GameStatus.started) {
                        return
                    }
                    const {periodIndex} = gameState
                    const gamePeriodState = gameState.periods[periodIndex]
                    const {prepareTime, tradeTime, resultTime} = CONFIG,
                        periodCountDown = countDown % (prepareTime + tradeTime + resultTime)
                    /*                    Array(CreateGame.playerLimit - gameState.playerIndex).fill(null).forEach(
                                            async (_, i) => await this.startNewRobotScheduler(`$Robot_${i}`)
                                        )*/
                    const playerStates = await this.getActivePlayerStates()
                    switch (periodCountDown) {
                        case prepareTime: {
                            gamePeriodState.stage = PeriodStage.trading
                            this.broadcast(PushType.beginTrading)
                            break
                        }
                        case prepareTime + tradeTime: {
                            gamePeriodState.stage = PeriodStage.result
                            const {periodIndex} = gameState
                            if (![PERIOD - 1, (PERIOD / 2 - 1)].includes(periodIndex)) {
                                break
                            }
                            const countArr = [], priceArr = []
                            playerStates.sort((p1, p2) => p1.count - p2.count)
                                .forEach(({count, privatePrices}) => {
                                    countArr.push(count)
                                    priceArr.push(privatePrices[periodIndex])
                                })
                            gamePeriodState.balancePrice = priceArr[getBalanceIndex(countArr)]
                            break
                        }
                        case 0: {
                            if (gameState.periodIndex === PERIOD - 1) {
                                global.clearInterval(timer)
                                break
                            }
                            const periodIndex = ++gameState.periodIndex
                            const [min, max] = PrivatePriceRegion[gameState.type][periodIndex],
                                periodTrend = min - PrivatePriceRegion[gameState.type][periodIndex - 1][0],
                                privatePrices = playerStates.map(() => random(min, max))
                                    .sort((m, n) => (m - n) * periodTrend)
                            playerStates.sort((p1, p2) => p1.count - p2.count)
                                .forEach((playerState, i) => {
                                    playerState.privatePrices[gameState.periodIndex] = privatePrices[i]
                                })
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
                if (count <= 0 ||
                    (params.role === ROLE.Seller && count > playerState.count) ||
                    (params.role === ROLE.Buyer && count * price > playerState.point)
                ) {
                    Log.d('数量有误，无法继续报价')
                } else {
                    const newOrder: IOrder = {
                        id: gamePeriodState.orders.length,
                        playerIndex,
                        role: params.role,
                        price,
                        count
                    }
                    await this.shoutNewOrder(periodIndex, newOrder)
                }
                break
            }
            case MoveType.cancelOrder: {
                const {periodIndex} = gameState
                await this.cancelOrder(periodIndex, playerState.playerIndex)
                break
            }
            case MoveType.exitGame: {
                const {onceMore} = params
                const res = await RedisCall.call<PhaseDone.IReq, PhaseDone.IRes>(PhaseDone.name, {
                    playUrl: gameId2PlayUrl(namespace, this.game.id, actor.token),
                    onceMore
                })
                res ? cb(res.lobbyUrl) : null
                break
            }
        }
    }

    async shoutNewOrder(periodIndex: number, order: IOrder): Promise<void> {
        const playerStates = await this.getActivePlayerStates()
        const gamePeriodState = (await this.stateManager.getGameState()).periods[periodIndex],
            {buyOrderIds, sellOrderIds, trades, orders} = gamePeriodState
        const marketRejected = order.role === ROLE.Seller ?
            sellOrderIds[0] && order.price > orders.find(({id}) => id === sellOrderIds[0]).price :
            buyOrderIds[0] && order.price < orders.find(({id}) => id === buyOrderIds[0]).price
        if (marketRejected) {
            return
        } else {
            await this.cancelOrder(periodIndex, order.playerIndex)
            orders.push(order)
        }
        const tradeSuccess = order.role === ROLE.Seller ?
            buyOrderIds[0] && order.price <= orders.find(({id}) => id === buyOrderIds[0]).price :
            sellOrderIds[0] && order.price >= orders.find(({id}) => id === sellOrderIds[0]).price
        if (!tradeSuccess) {
            (order.role === ROLE.Seller ? sellOrderIds : buyOrderIds).unshift(order.id)
            return
        }
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
        gamePeriodState.closingPrice = pairOrder.price
        playerStates.forEach(playerState => {
            const playerRole = playerState.playerIndex === order.playerIndex ? order.role :
                playerState.playerIndex === pairOrder.playerIndex ? pairOrder.role : null
            switch (playerRole) {
                case ROLE.Buyer:
                    playerState.count += trade.count
                    playerState.point -= trade.count * pairOrder.price
                    break
                case ROLE.Seller:
                    playerState.count -= trade.count
                    playerState.point += trade.count * pairOrder.price
                    break
            }
        })
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

    async getActivePlayerStates(): Promise<TPlayerState<IPlayerState>[]> {
        const playerStates = await this.stateManager.getPlayerStates()
        return Object.values(playerStates).filter(({playerIndex}) => playerIndex !== undefined)
    }
}
