import {BaseRobot} from '@bespoke/robot'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from './config'
import {GameStatus} from '@bespoke/server'
import {Number} from './util'

export class Robot extends BaseRobot<ICreateParams,
    IGameState,
    IPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams> {
    timer: NodeJS.Timer

    async init(): Promise<this> {
        await super.init()
        this.frameEmitter.emit(MoveType.testDone)
        this.timer = global.setInterval(() => {
            if (!this.playerState || this.playerState.index === undefined) {
                return null
            }
            if (this.gameState.status === GameStatus.over || this.gameState.traded || this.gameState.shouts[this.playerState.index] >= this.playerState.privatePrice) {
                return global.clearInterval(this.timer)
            }
            let maxShouts = this.gameState.startPrice
            this.gameState.shouts.forEach(s => s > maxShouts ? maxShouts = s : null)
            let price = Number.format(maxShouts + Math.random() * 5)
            if (price > this.playerState.privatePrice) {
                price = this.playerState.privatePrice
            }
            this.frameEmitter.emit(MoveType.shout, {price})
        }, (Math.random() * 10 + 5) * 1e3)
        return this
    }
}
