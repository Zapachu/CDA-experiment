import {gameData} from './gameData'
import {PushType} from '../../config'
import {Envelope, Player} from './component'

export class Players extends egret.DisplayObjectContainer {

    players: Array<Player> = []
    envelopes: Array<Envelope> = []

    constructor() {
        super()
        gameData.frameEmitter.on(PushType.playerEnter, ({positionIndex}) => {
            const player = new Player(positionIndex === gameData.positionIndex),
                x = this.width - gameData.span(positionIndex + 2)
            this.players[positionIndex] = player
            this.addChild(player)
            egret.Tween.get(player).to({x}, 100 * (gameData.game.params.groupSize - positionIndex))

            const envelope = new Envelope({x: x - 20, y: 70},
                this.globalToLocal(gameData.span(3.5) - positionIndex * 10, gameData.span(3)))
            this.envelopes[positionIndex] = envelope
            this.addChild(envelope)
        })
        gameData.frameEmitter.on(PushType.someoneShout, ({positionIndex}) => this.envelopes[positionIndex].send())
        gameData.frameEmitter.on(PushType.win, ({positionIndex}) => this.players[positionIndex].win())
        gameData.frameEmitter.on(PushType.newRound, ({round}) => {
            gameData.round = round
            this.players.forEach(player => player.reset())
            this.envelopes.forEach(envelope => envelope.reset())
        })
    }
}