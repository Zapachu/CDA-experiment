import {BaseRobot} from 'bespoke-robot'
import {Config, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from './config'

export class Robot extends BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {

    async init(): Promise<this> {
        await super.init()
        setTimeout(() => this.frameEmitter.emit(MoveType.getIndex), 1e3)
        this.frameEmitter.on(PushType.beginRound, ({round}) => {
            const price = this.playerState.privatePrices[round] + ~~(Math.random() * Config.TRADE_TIME >> 2)
            setTimeout(() => this.frameEmitter.emit(MoveType.shout, {price}), Math.random() * 10e3)
        })
        return this
    }
}