import {BaseRobot, FreeStyleModel, redisClient} from 'bespoke-server'
import * as dateFormat from 'dateformat'
import {
    AdjustDirection,
    DBKey,
    ICreateParams,
    IGamePeriodState,
    IGameState,
    IMoveParams,
    IOrder,
    IPlayerState,
    IPushParams,
    MoveType,
    PushType,
    RedisKey,
    RobotCalcLog,
    RobotSubmitLog,
    ROLE,
    ShoutResult,
    PeriodStage,
    MOCK
} from './config'

const SLEEP_TIME = 1000 * Math.random() + 2000

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
        setTimeout(() => this.frameEmitter.emit(MoveType.getIndex), SLEEP_TIME)
        this.frameEmitter.on(PushType.beginTrading, () => {
            this.zipActive = false
            setTimeout(() => {
                const u = (this.role === ROLE.Seller ? 1 : -1) * (.2 * Math.random() - .1),
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
            if (this.playerState.playerIndex === this.orderDict[newOrderId].playerIndex) {
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

    //region getter
    get role(): ROLE {
        return (this.playerState.playerIndex + this.gameState.periodIndex) % 2 ? ROLE.Seller : ROLE.Buyer
    }

    get gamePeriodState(): IGamePeriodState {
        return this.gameState.periods[this.gameState.periodIndex]
    }

    get sleepTime(): number {
        return SLEEP_TIME * (0.75 + 0.5 * Math.random())
    }

    get orderDict(): { [id: number]: IOrder } {
        const orderDict: { [id: number]: IOrder } = {}
        this.gamePeriodState.orders.forEach(order => {
            orderDict[order.id] = order
        })
        return orderDict
    }

    get unitPrice(): number {
        return ~~(MOCK.price * (Math.random() * .2 + .9))
    }

    //endregion

    //region util
    formatPrice(price: number) {
        return Math.round(price)
    }

    //endregion

    wakeUp(): void {
        if (this.gamePeriodState.stage === PeriodStage.trading && (
            (this.role === ROLE.Seller && this.playerState.count > 0) ||
            (this.role === ROLE.Buyer && this.playerState.point > this.playerState.count * this.unitPrice)
        )) {
            redisClient.incr(RedisKey.robotActionSeq(this.game.id)).then(seq => this.submitOrder(seq))
            setTimeout(() => this.wakeUp(), this.sleepTime)
        }
    }

    respondNewOrder(newOrderId: number) {
        const {orderDict, role, zipFreeField: {calcPrice}} = this,
            newOrder = orderDict[newOrderId]
        const newOrderRole = newOrder.role
        if (newOrderRole === role &&
            ((role === ROLE.Buyer && calcPrice <= newOrder.price) ||
                (role === ROLE.Seller && calcPrice >= newOrder.price)
            )) {
            this.adjustProfitRate(AdjustDirection.lower, newOrder.price)
        }
    }

    respondNewTrade(resOrderId: number) {
        const {orderDict, role} = this,
            resOrder = orderDict[resOrderId]
        const {reqOrderId} = this.gamePeriodState.trades.find(({resOrderId}) => resOrderId === resOrderId),
            {price: tradePrice} = orderDict[reqOrderId]
        const resRole = resOrder.role
        if ((role === ROLE.Buyer && this.zipFreeField.calcPrice >= tradePrice) ||
            (role === ROLE.Seller && this.zipFreeField.calcPrice <= tradePrice)) {
            this.adjustProfitRate(AdjustDirection.raise, tradePrice)
        } else if (resRole !== role) {
            this.adjustProfitRate(AdjustDirection.lower, tradePrice)
        }
    }

    adjustProfitRate(adjustDirection: AdjustDirection, q: number): void {
        const {role, unitPrice} = this
        let prePrice = this.zipFreeField.calcPrice || unitPrice * (1 + this.zipFreeField.u)
        const {beta, r, Gamma} = this.zipFreeField
        const tmp = (adjustDirection === AdjustDirection.raise ? 0.05 : -0.05) * (role === ROLE.Seller ? 1 : -1),
            R = (1 + Math.random() * tmp), A = Math.random() * tmp
        const tau = R * q + A,
            delta = beta * (tau - prePrice)
        this.zipFreeField.Gamma = Gamma * r + (1 - r) * delta
        let newPrice = this.formatPrice(prePrice + this.zipFreeField.Gamma)
        if (newPrice !== prePrice) {
            this.zipFreeField.calcPrice = newPrice
            redisClient.incr(RedisKey.robotActionSeq(this.game.id)).then(async seq => {
                const data: RobotCalcLog = {
                    seq,
                    playerSeq: this.playerState.playerIndex + 1,
                    role: ROLE[this.role],
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
            gamePeriodState: {buyOrderIds, sellOrderIds},
            orderDict, unitPrice
        } = this
        const [wouldBeRejected = false, rejectPrice] = {
            [ROLE.Seller]: sellOrderIds[0] ? [calcPrice >= orderDict[sellOrderIds[0]].price, orderDict[sellOrderIds[0]].price] : [],
            [ROLE.Buyer]: buyOrderIds[0] ? [calcPrice <= orderDict[buyOrderIds[0]].price, orderDict[buyOrderIds[0]].price] : []
        }[this.role]
        if (wouldBeRejected) {
            this.zipFreeField.calcPrice = calcPrice
            this.adjustProfitRate(AdjustDirection.lower, rejectPrice as any)
            return
        }
        this.zipFreeField.u = calcPrice / this.unitPrice - 1
        const data: Partial<RobotSubmitLog> = {
            seq,
            playerSeq: this.playerState.playerIndex + 1,
            role: ROLE[this.role],
            ValueCost: unitPrice,
            price: calcPrice,
            buyOrders: buyOrderIds.map(id => orderDict[id].price).join(','),
            sellOrders: sellOrderIds.map(id => orderDict[id].price).join(','),
            timestamp: dateFormat(Date.now(), 'HH:MM:ss:l')
        }
        const maxCount = this.role === ROLE.Seller ? this.playerState.count : ~~(this.playerState.point / this.unitPrice)
        this.frameEmitter.emit(MoveType.submitOrder, {
            price: calcPrice,
            count: ~~(maxCount * (.7 * Math.random() + .3)) + 1,
            role: this.role
        }, async (shoutResult: ShoutResult, marketBuyOrders, marketSellOrders) => {
            await new FreeStyleModel({
                game: this.game.id,
                key: DBKey.robotSubmitLog,
                data: {...data, shoutResult, marketBuyOrders, marketSellOrders}
            }).save()
        })
    }
}
