import {
    BaseController,
    baseEnum,
    gameId2PlayUrl,
    IActor,
    IMoveCallback,
    Log,
    RedisCall,
    TGameState,
    TPlayerState
} from 'bespoke-server'
import {
    CONFIG,
    GameType,
    ICreateParams,
    Identity,
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
    PrivatePriceRegion,
    PushType,
    ROLE
} from './config'
import {phaseToNamespace, Phase} from 'bespoke-game-stock-trading-config'
import {CreateGame, GameOver} from 'elf-protocol'
import {getBalanceIndex, getEnumKeys, random} from './util'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
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
            money: 3e4 + ~~(Math.random() * 1e4)
        }
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        const {type} = await this.stateManager.getGameState()
        const [[min, max]] = PrivatePriceRegion[type]
        playerState.privatePrices = [random(min, max)]
        playerState.guaranteeMoney = 0
        playerState.guaranteeCount = 0
        return playerState
    }

    async guaranteeWithCountRobot(playerIndex: number, count: number) {
        const playerStates = await this.getActivePlayerStates(),
            playerState = playerStates.find(s => s.playerIndex === playerIndex)
        playerState.count += count
        playerState.guaranteeCount += count
        const countRobot = playerStates.find(({identity}) => identity === Identity.stockGuarantor)
        countRobot.count -= count
        if (playerState.count < 0) {
            const {periodIndex, periods} = await this.stateManager.getGameState(),
                {balancePrice} = periods[periodIndex]
            const money = -playerState.count * balancePrice
            playerState.money -= money
            playerState.count = 0
            countRobot.money += money
        }
    }

    async guaranteeWithMoneyRobot(playerIndex: number, money: number) {
        const playerStates = await this.getActivePlayerStates(),
            playerState = playerStates.find(s => s.playerIndex === playerIndex)
        playerState.money += money
        playerState.guaranteeMoney += money
        playerStates.find(({identity}) => identity === Identity.moneyGuarantor).money -= money
    }

    async shoutNewOrder(periodIndex: number, order: IOrder): Promise<void> {
        const playerStates = await this.getActivePlayerStates()
        const gamePeriodState = (await this.stateManager.getGameState()).periods[periodIndex],
            {buyOrderIds, sellOrderIds, trades, orders} = gamePeriodState
        const marketRejected = order.role === ROLE.Seller ?
            sellOrderIds[0] && order.price > orders.find(({id}) => id === sellOrderIds[0]).price :
            buyOrderIds[0] && order.price < orders.find(({id}) => id === buyOrderIds[0]).price
        Log.d('Market rejected : ', {price: order.price, count: order.count, role: order.role})
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
            const o = playerState.playerIndex === order.playerIndex ? order :
                playerState.playerIndex === pairOrder.playerIndex ? pairOrder : null
            if (!o) {
                return null
            }
            this.push(playerState.actor, PushType.tradeSuccess, {tradeCount: trade.count})
            switch (o.role) {
                case ROLE.Buyer:
                    const money = trade.count * pairOrder.price
                    playerState.count += trade.count
                    o.guarantee ? playerState.guaranteeMoney += money : playerState.money -= money
                    break
                case ROLE.Seller:
                    o.guarantee ? playerState.guaranteeCount += trade.count : playerState.count -= trade.count
                    playerState.money += trade.count * pairOrder.price
                    break
            }
        })
    }

    async cancelOrder(periodIndex: number, playerIndex: number): Promise<void> {
        const {buyOrderIds, sellOrderIds, orders} = (await this.stateManager.getGameState()).periods[periodIndex]
        for (let i = 0; i < buyOrderIds.length; i++) {
            const targetOrder = orders.find(({id}) => id === buyOrderIds[i])
            if (targetOrder.playerIndex === playerIndex) {
                buyOrderIds.splice(i, 1)
                return
            }
        }
        for (let i = 0; i < sellOrderIds.length; i++) {
            const targetOrder = orders.find(({id}) => id === sellOrderIds[i])
            if (targetOrder.playerIndex === playerIndex) {
                sellOrderIds.splice(i, 1)
                return
            }
        }
    }

    async getActivePlayerStates(playerIndex?: number): Promise<TPlayerState<IPlayerState>[]> {
        const playerStates = await this.stateManager.getPlayerStates()
        return Object.values(playerStates).filter(s => playerIndex ? s.playerIndex === playerIndex : s.playerIndex !== undefined)
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor),
            playerStates = await this.getActivePlayerStates()
        switch (type) {
            case MoveType.getIndex: {
                if (playerState.playerIndex !== undefined) {
                    break
                }
                playerState.playerIndex = gameState.playerIndex++
                switch (true) {
                    case actor.type === baseEnum.Actor.serverRobot && playerStates.every(({identity}) => identity != Identity.moneyGuarantor):
                        playerState.identity = Identity.moneyGuarantor
                        playerState.count = 0
                        playerState.money = gameState.initialAsset.money * CreateGame.playerLimit
                        break
                    case actor.type === baseEnum.Actor.serverRobot && playerStates.every(({identity}) => identity != Identity.stockGuarantor):
                        playerState.identity = Identity.stockGuarantor
                        playerState.count = gameState.initialAsset.count * CreateGame.playerLimit
                        playerState.money = 0
                        break
                    default:
                        playerState.identity = Identity.retailPlayer
                        playerState.count = gameState.initialAsset.count
                        playerState.money = gameState.initialAsset.money
                }
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
                    const playerStates = await this.getActivePlayerStates()
                    switch (periodCountDown) {
                        case ~~(prepareTime / 2): {
                            if (periodIndex === 0) {
                                Array(2 + CreateGame.playerLimit - gameState.playerIndex).fill(null).forEach(
                                    async (_, i) => await this.startRobot(`$Robot_${i}`))
                            }
                            break
                        }
                        case prepareTime: {
                            gamePeriodState.stage = PeriodStage.trading
                            this.broadcast(PushType.beginTrading)
                            break
                        }
                        case prepareTime + tradeTime: {
                            gamePeriodState.stage = PeriodStage.result
                            const {periodIndex} = gameState
                            if (periodIndex % 2 === 0) {
                                break
                            }
                            const countArr = [], priceArr = []
                            playerStates.sort((p1, p2) => p1.count - p2.count)
                                .forEach(({count, privatePrices}) => {
                                    countArr.push(count)
                                    priceArr.push(privatePrices[periodIndex])
                                })
                            gamePeriodState.balancePrice = priceArr[getBalanceIndex(countArr)]
                            playerStates.forEach(async playerState => {
                                const asset = gamePeriodState.balancePrice * playerState.count + playerState.money,
                                    guaranteeAsset = gamePeriodState.balancePrice * playerState.guaranteeCount + playerState.guaranteeMoney
                                if (asset < guaranteeAsset * 1.3) {
                                    await this.guaranteeWithMoneyRobot(playerState.playerIndex, -playerState.guaranteeMoney)
                                    await this.guaranteeWithCountRobot(playerState.playerIndex, -playerState.guaranteeCount)
                                    this.push(playerState.actor, PushType.closeOut)
                                    return
                                }
                                if (asset < guaranteeAsset * 1.5) {
                                    this.push(playerState.actor, PushType.closeOutWarning)
                                }
                            })
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
                    this.broadcast(PushType.countDown, {countDown: periodCountDown})
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
                    (params.role === ROLE.Buyer && count * price > playerState.money)
                ) {
                    Log.d('ShoutFailed : ', {
                        role: ROLE[params.role],
                        count: playerState.count,
                        money: playerState.money
                    })
                } else {
                    const newOrder: IOrder = {
                        id: gamePeriodState.orders.length,
                        playerIndex,
                        role: params.role,
                        price,
                        count,
                        guarantee: params.guarantee
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
            case MoveType.repayMoney: {
                playerState.money -= params.moneyRepay
                playerState.guaranteeMoney -= params.moneyRepay
                playerStates.find(({identity}) => identity === Identity.moneyGuarantor).money += params.moneyRepay
                break
            }
            case MoveType.repayCount: {
                playerState.count -= params.countRepay
                playerState.guaranteeCount -= params.countRepay
                playerStates.find(({identity}) => identity === Identity.stockGuarantor).count += params.countRepay
                break
            }
            case MoveType.exitGame: {
                const {onceMore} = params
                const res = await RedisCall.call<GameOver.IReq, GameOver.IRes>(GameOver.name, {
                    playUrl: gameId2PlayUrl(this.game.id, actor.token),
                    onceMore,
                    namespace: phaseToNamespace(this.game.params.allowLeverage ? Phase.CBM_Leverage : Phase.CBM)
                })
                res ? cb(res.lobbyUrl) : null
                break
            }
        }
    }
}
