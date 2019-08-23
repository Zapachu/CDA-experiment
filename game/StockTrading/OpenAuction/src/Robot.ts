import {BaseRobot} from '@bespoke/robot'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType, ROUNDS} from './config'
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

    get gameRoundState(){
        return this.gameState.rounds[this.gameState.round]
    }

    get playerRoundState(){
        return this.playerState.rounds[this.gameState.round]
    }

    async init(): Promise<this> {
        await super.init()
        this.frameEmitter.emit(MoveType.testDone)
        this.timer = global.setInterval(() => {
            if (!this.playerState || this.playerState.index === undefined) {
                return null
            }
            if (this.gameState.status === GameStatus.over || this.gameRoundState.traded || this.gameRoundState.shouts[this.playerState.index] >= this.playerRoundState.privatePrice) {
                if(this.gameState.status === GameStatus.over || this.gameState.round === ROUNDS-1){
                    global.clearInterval(this.timer)
                }
                return
            }
            let maxShout = this.gameRoundState.startPrice
            this.gameRoundState.shouts.forEach(s => s > maxShout ? maxShout = s : null)
            if(maxShout > this.playerRoundState.privatePrice){
                return
            }
            let price = Number.format(maxShout + Math.random() * 5)
            if (price > this.playerRoundState.privatePrice) {
                price = this.playerRoundState.privatePrice
            }
            this.frameEmitter.emit(MoveType.shout, {price})
        }, (Math.random() * 10 + 5) * 1e3)
        return this
    }
}
