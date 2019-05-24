import {BaseRobot, baseEnum} from 'bespoke-server'
import {
    ICreateParams,
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

    async init(): Promise<BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>> {
        setTimeout(() => this.frameEmitter.emit(MoveType.getIndex), Math.random() * 1000)
        this.frameEmitter.on(PushType.beginTrading, () => {
            global.setInterval(() => {
                if (this.gameState.periodIndex === PERIOD - 1 && this.gameState.periods[this.gameState.periodIndex].stage === PeriodStage.result) {
                    global.clearInterval(this.sleepLoop)
                }
                if (this.gameState.status !== baseEnum.GameStatus.started) {
                    return
                }
                this.wakeUp()
            }, 5000 * Math.random() + 10000)
        })
        return this
    }

    wakeUp(): void {
        if (this.gameState.periods[this.gameState.periodIndex].stage !== PeriodStage.trading) {
            return
        }
        const privatePrice = this.playerState.privatePrices[this.gameState.periodIndex]
        const role = Math.random() > .5 ? ROLE.Seller : ROLE.Buyer
        const price = privatePrice + ~~(Math.random() * 10 * (role === ROLE.Seller ? 1 : -1))
        const maxCount = role === ROLE.Seller ? this.playerState.count : this.playerState.point / privatePrice,
            count = ~~(maxCount * (.7 * Math.random() + .3)) + 1
        this.frameEmitter.emit(MoveType.submitOrder, {price, count, role})
    }
}
