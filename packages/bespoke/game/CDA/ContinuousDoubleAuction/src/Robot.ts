import {Model, redisClient} from 'bespoke-server'
import {BaseRobot} from 'bespoke-robot'
import * as dateFormat from 'dateformat'
import {
    AdjustDirection,
    DBKey,
    MarketStage,
    MoveType,
    phaseNames,
    PushType,
    RedisKey,
    RobotCalcLog,
    RobotSubmitLog,
    ROLE,
    ShoutResult,
    ReactionType
} from './config'
import {GameState, ICreateParams, CreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'

interface IZipFreeField {
    beta: number
    r: number
    Gamma: number
    u: number
    calcPrice?: number
}

export default class extends BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    zipActive: boolean
    zipFreeField: IZipFreeField

    async init(): Promise<this> {
        await super.init()
        this.frameEmitter.on(PushType.assignedPosition, () => {
            setTimeout(() => this.frameEmitter.emit(MoveType.enterMarket, {seatNumber: ~~(Math.random() * 10000)}), Math.random() * 3000)
        })
        this.frameEmitter.on(PushType.periodOpen, () => {
            this.zipActive = false
            setTimeout(() => {
                const u = (this.position.role === ROLE.Seller ? 1 : -1) * (.05 + .3 * Math.random()),
                    calcPrice = this.formatPrice(this.unitPrice * (1 + u))
                this.zipActive = true
                this.zipFreeField = {
                    beta: 0.1 + 0.4 * Math.random(),
                    r: 0.1 * Math.random(),
                    Gamma: 0,
                    u,
                    calcPrice
                }
                setTimeout(() => this.wakeUp(), this.sleepTime)
            }, this.game.params.phases[this.gameState.gamePhaseIndex].params.startTime[this.playerState.positionIndex])
        })
        this.frameEmitter.on(PushType.newOrder, ({newOrderId}) => {
            if (!this.zipActive) {
                return
            }
            if (this.position.reactionType === ReactionType.TradeAndOrder || this.playerState.positionIndex === this.orderDict[newOrderId].positionIndex) {
                this.respondNewOrder(newOrderId)
            }
        })
        this.frameEmitter.on(PushType.newTrade, ({resOrderId}) => {
            if (!this.zipActive) {
                return
            }
            this.respondNewTrade(resOrderId)
        })
        return this
    }

    //region market
    //region getter

    get position():CreateParams.Phase.Params.IPosition {
        const {positions} = this.game.params.phases[0].params,
            {positionIndex} = this.playerState,
            position = {...positions[positionIndex]}
        position.interval = 1000 * position.interval
        return position
    }

    get sleepTime(): number {
        return this.position.interval * (0.75 + 0.5 * Math.random())
    }

    get gamePhaseState(): GameState.IGamePhaseState {
        return this.gameState.phases[this.gameState.gamePhaseIndex]
    }

    get orderDict(): { [id: number]: GameState.IOrder } {
        const orderDict: { [id: number]: GameState.IOrder } = {}
        this.gameState.orders.forEach(order => {
            orderDict[order.id] = order
        })
        return orderDict
    }

    get unitIndex(): number {
        return this.gamePhaseState.positionUnitIndex[this.playerState.positionIndex]
    }

    get unitPrice(): number {
        try {
            const {gameState: {gamePhaseIndex}, playerState: {unitLists}} = this
            return +(unitLists[gamePhaseIndex].split(' ')[this.unitIndex])
        } catch (e) {
            return 0
        }
    }

    //endregion

    //region util
    formatPrice(price: number) {
        return Math.round(price)
    }

    //endregion

    wakeUp(): void {
        if (this.game.params.phases[this.gameState.gamePhaseIndex].templateName === phaseNames.mainGame &&
            this.gamePhaseState.marketStage === MarketStage.trading && this.unitPrice) {
            redisClient.incr(RedisKey.robotActionSeq(this.game.id)).then(seq => this.submitOrder(seq))
            setTimeout(() => this.wakeUp(), this.sleepTime)
        }
    }

    respondNewOrder(newOrderId: number) {
        const {orderDict, game, position: {role}, zipFreeField: {calcPrice}} = this,
            newOrder = orderDict[newOrderId],
            {positions} = game.params.phases[0].params
        const {role: newOrderRole} = positions[newOrder.positionIndex]
        if (newOrderRole === role &&
            ((role === ROLE.Buyer && calcPrice <= newOrder.price) ||
                (role === ROLE.Seller && calcPrice >= newOrder.price)
            )) {
            this.adjustProfitRate(AdjustDirection.lower, newOrder.price)
        }
    }

    respondNewTrade(resOrderId: number) {
        const {orderDict, game, position: {role}} = this,
            resOrder = orderDict[resOrderId],
            {positions} = game.params.phases[0].params
        const {reqId} = this.gamePhaseState.trades.find(({resId}) => resId === resOrderId),
            {price: tradePrice} = orderDict[reqId]
        const resRole = positions[resOrder.positionIndex].role
        if ((role === ROLE.Buyer && this.zipFreeField.calcPrice >= tradePrice) ||
            (role === ROLE.Seller && this.zipFreeField.calcPrice <= tradePrice)) {
            this.adjustProfitRate(AdjustDirection.raise, tradePrice)
        } else if (resRole !== role) {
            this.adjustProfitRate(AdjustDirection.lower, tradePrice)
        }
    }

    adjustProfitRate(adjustDirection: AdjustDirection, q: number): void {
        const {position: {role}, unitPrice, unitIndex} = this
        let prePrice = this.zipFreeField.calcPrice || unitPrice * (1 + this.zipFreeField.u)
        const {beta, r, Gamma} = this.zipFreeField
        const tmp = (adjustDirection === AdjustDirection.raise ? 0.05 : -0.05) * (role === ROLE.Seller ? 1 : -1),
            R = (1 + Math.random() * tmp), A = Math.random() * tmp
        const tau = R * q + A,
            delta = beta * (tau - prePrice)
        this.zipFreeField.Gamma = Gamma * r + (1 - r) * delta
        let newPrice = this.formatPrice(prePrice + this.zipFreeField.Gamma)
        const priceOverflow = {
            [ROLE.Seller]: newPrice < unitPrice,
            [ROLE.Buyer]: newPrice > unitPrice
        }[role]
        if (priceOverflow) {
            newPrice = unitPrice
        }
        if (newPrice !== prePrice) {
            this.zipFreeField.calcPrice = newPrice
            redisClient.incr(RedisKey.robotActionSeq(this.game.id)).then(async seq => {
                const data: RobotCalcLog = {
                    seq,
                    playerSeq: this.playerState.positionIndex + 1,
                    unitIndex,
                    role: ROLE[this.position.role],
                    R,
                    A,
                    q,
                    tau,
                    beta,
                    p: prePrice,
                    delta,
                    r,
                    LagGamma: Gamma,
                    Gamma: this.zipFreeField.Gamma,
                    ValueCost: unitPrice,
                    u: newPrice / unitPrice - 1,
                    CalculatedPrice: newPrice,
                    timestamp: dateFormat(Date.now(), 'HH:MM:ss:l')
                }
                await new Model.FreeStyleModel({
                    game: this.game.id,
                    key: DBKey.robotCalcLog,
                    data
                }).save()
            })
        }
    }

    submitOrder(seq: number): void {
        const {
            zipFreeField: {calcPrice},
            gameState: {gamePhaseIndex},
            gamePhaseState: {buyOrderIds, sellOrderIds},
            orderDict, unitIndex, unitPrice
        } = this
        const [wouldBeRejected = false, rejectPrice] = {
            [ROLE.Seller]: sellOrderIds[0] ? [calcPrice >= orderDict[sellOrderIds[0]].price, orderDict[sellOrderIds[0]].price] : [],
            [ROLE.Buyer]: buyOrderIds[0] ? [calcPrice <= orderDict[buyOrderIds[0]].price, orderDict[buyOrderIds[0]].price] : []
        }[this.position.role]
        if (wouldBeRejected) {
            this.zipFreeField.calcPrice = calcPrice
            this.adjustProfitRate(AdjustDirection.lower, rejectPrice)
            return
        }
        this.zipFreeField.u = calcPrice / this.unitPrice - 1
        const data: Partial<RobotSubmitLog> = {
            seq,
            playerSeq: this.playerState.positionIndex + 1,
            unitIndex,
            role: ROLE[this.position.role],
            ValueCost: unitPrice,
            price: calcPrice,
            buyOrders: buyOrderIds.map(id => orderDict[id].price).join(','),
            sellOrders: sellOrderIds.map(id => orderDict[id].price).join(','),
            timestamp: dateFormat(Date.now(), 'HH:MM:ss:l')
        }
        this.frameEmitter.emit(MoveType.submitOrder, {
            price: calcPrice,
            unitIndex,
            gamePhaseIndex
        }, async (shoutResult: ShoutResult, marketBuyOrders, marketSellOrders) => {
            await new Model.FreeStyleModel({
                game: this.game.id,
                key: DBKey.robotSubmitLog,
                data: {...data, shoutResult, marketBuyOrders, marketSellOrders}
            }).save()
        })
    }

    //endregion
}