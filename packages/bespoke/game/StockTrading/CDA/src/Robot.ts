import {BaseRobot, FreeStyleModel, redisClient} from 'bespoke-server'
import * as dateFormat from 'dateformat'
import {
    AdjustDirection,
    DBKey,
    MarketStage,
    MoveType,
    PushType,
    RedisKey,
    RobotCalcLog,
    RobotSubmitLog,
    ROLE,
    ShoutResult
} from './config'
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'

const SLEEP_TIME = 3000

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

    async init(): Promise<BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>> {
        this.frameEmitter.on(PushType.assignedPosition, () => {
            setTimeout(() => this.frameEmitter.emit(MoveType.enterMarket), Math.random() * 3000)
        })
        this.frameEmitter.on(PushType.periodOpen, () => {
            this.zipActive = false
            setTimeout(() => {
                const u = (this.position === ROLE.Seller ? 1 : -1) * (.05 + .3 * Math.random()),
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
            }, Math.random() * SLEEP_TIME)
        })
        this.frameEmitter.on(PushType.newOrder, ({newOrderId}) => {
            if (!this.zipActive) {
                return
            }
            if (this.playerState.positionIndex === this.orderDict[newOrderId].positionIndex) {
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

    get position(): ROLE {
        const {roles} = this.game.params,
            {positionIndex} = this.playerState
        return roles[positionIndex]
    }

    get sleepTime(): number {
        return SLEEP_TIME * (0.75 + 0.5 * Math.random())
    }

    get orderDict(): { [id: number]: GameState.IOrder } {
        const orderDict: { [id: number]: GameState.IOrder } = {}
        this.gameState.orders.forEach(order => {
            orderDict[order.id] = order
        })
        return orderDict
    }

    get unitIndex(): number {
        return this.gameState.positionUnitIndex[this.playerState.positionIndex]
    }

    get unitPrice(): number {
        try {
            const {playerState: {unitList}} = this
            return +(unitList.split(' ')[this.unitIndex])
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
        if (this.gameState.marketStage === MarketStage.trading && this.unitPrice) {
            redisClient.incr(RedisKey.robotActionSeq(this.game.id)).then(seq => this.submitOrder(seq))
            setTimeout(() => this.wakeUp(), this.sleepTime)
        }
    }

    respondNewOrder(newOrderId: number) {
        const {orderDict, game, position: role, zipFreeField: {calcPrice}} = this,
            newOrder = orderDict[newOrderId],
            {roles} = game.params
        const newOrderRole = roles[newOrder.positionIndex]
        if (newOrderRole === role &&
            ((role === ROLE.Buyer && calcPrice <= newOrder.price) ||
                (role === ROLE.Seller && calcPrice >= newOrder.price)
            )) {
            this.adjustProfitRate(AdjustDirection.lower, newOrder.price)
        }
    }

    respondNewTrade(resOrderId: number) {
        const {orderDict, game, position: role} = this,
            resOrder = orderDict[resOrderId],
            {roles} = game.params
        const {reqId} = this.gameState.trades.find(({resId}) => resId === resOrderId),
            {price: tradePrice} = orderDict[reqId]
        const resRole = roles[resOrder.positionIndex]
        if ((role === ROLE.Buyer && this.zipFreeField.calcPrice >= tradePrice) ||
            (role === ROLE.Seller && this.zipFreeField.calcPrice <= tradePrice)) {
            this.adjustProfitRate(AdjustDirection.raise, tradePrice)
        } else if (resRole !== role) {
            this.adjustProfitRate(AdjustDirection.lower, tradePrice)
        }
    }

    adjustProfitRate(adjustDirection: AdjustDirection, q: number): void {
        const {position: role, unitPrice, unitIndex} = this
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
                    role: ROLE[this.position],
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
                await new FreeStyleModel({
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
            gameState: {buyOrderIds, sellOrderIds},
            orderDict, unitIndex, unitPrice
        } = this
        const [wouldBeRejected = false, rejectPrice] = {
            [ROLE.Seller]: sellOrderIds[0] ? [calcPrice >= orderDict[sellOrderIds[0]].price, orderDict[sellOrderIds[0]].price] : [],
            [ROLE.Buyer]: buyOrderIds[0] ? [calcPrice <= orderDict[buyOrderIds[0]].price, orderDict[buyOrderIds[0]].price] : []
        }[this.position]
        if (wouldBeRejected) {
            this.zipFreeField.calcPrice = calcPrice
            this.adjustProfitRate(AdjustDirection.lower, rejectPrice as any)
            return
        }
        this.zipFreeField.u = calcPrice / this.unitPrice - 1
        const data: Partial<RobotSubmitLog> = {
            seq,
            playerSeq: this.playerState.positionIndex + 1,
            unitIndex,
            role: ROLE[this.position],
            ValueCost: unitPrice,
            price: calcPrice,
            buyOrders: buyOrderIds.map(id => orderDict[id].price).join(','),
            sellOrders: sellOrderIds.map(id => orderDict[id].price).join(','),
            timestamp: dateFormat(Date.now(), 'HH:MM:ss:l')
        }
        this.frameEmitter.emit(MoveType.submitOrder, {
            price: calcPrice,
            unitIndex
        }, async (shoutResult: ShoutResult, marketBuyOrders, marketSellOrders) => {
            await new FreeStyleModel({
                game: this.game.id,
                key: DBKey.robotSubmitLog,
                data: {...data, shoutResult, marketBuyOrders, marketSellOrders}
            }).save()
        })
    }

    //endregion
}
