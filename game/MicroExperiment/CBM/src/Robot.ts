import {GameStatus} from '@bespoke/server'
import {BaseRobot} from '@bespoke/robot'
import {
    ICreateParams,
    Identity,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
    PERIOD,
    PeriodStage,
    PushType,
    ROLE
} from './config'

export default class extends BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    sleepLoop: NodeJS.Timer

    async init(): Promise<this> {
        await super.init()
        setTimeout(() => this.frameEmitter.emit(MoveType.getIndex), 1000)
        this.frameEmitter.on(PushType.beginTrading, () => {
            global.setInterval(() => {
                if (this.gameState.periodIndex === PERIOD - 1 && this.gameState.periods[this.gameState.periodIndex].stage === PeriodStage.result) {
                    global.clearInterval(this.sleepLoop)
                }
                if (this.gameState.status !== GameStatus.started) {
                    return
                }
                this.wakeUp()
            }, 5e3 * Math.random() + 10e3)
        })
        return this
    }

    wakeUp(): void {
        if (!this.playerState || !this.gameState) {
            return
        }
        const {stage, orders, sellOrderIds, buyOrderIds} = this.gameState.periods[this.gameState.periodIndex]
        if (stage !== PeriodStage.trading) {
            return
        }
        const privatePrice = this.playerState.privatePrices[this.gameState.periodIndex]
        const role = {
            [Identity.stockGuarantor]: ROLE.Buyer,
            [Identity.moneyGuarantor]: ROLE.Seller,
            [Identity.retailPlayer]: Math.random() > .5 ? ROLE.Seller : ROLE.Buyer
        }[this.playerState.identity]
        const price = privatePrice + ~~(Math.random() * 10 * (role === ROLE.Seller ? 1 : -1))
        const maxCount = role === ROLE.Seller ? this.playerState.count : this.playerState.money / privatePrice
        if (maxCount < 1) {
            return
        }
        const marketRejected = role === ROLE.Seller ?
            sellOrderIds[0] && price > orders.find(({id}) => id === sellOrderIds[0]).price :
            buyOrderIds[0] && price < orders.find(({id}) => id === buyOrderIds[0]).price
        if (marketRejected) {
            return
        }
        this.frameEmitter.emit(MoveType.submitOrder, {price, count: ~~(maxCount * (.3 * Math.random() + .2)) + 1, role})
    }
}
