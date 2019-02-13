import {FrameEmitter, IGame} from '@dev/common'
import {MoveType, PushType} from '../../config'
import {ICreateParams, IMoveParams, IPushParams} from '../../interface'

export const gameData = new class {
    dataEntryClassName = 'EgretEntry'
    egretContainerClassname = 'egret-player'
    game: IGame<ICreateParams>
    frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
    actorToken: string
    positionIndex: number
    privatePrices: Array<number>
    round:number = 0
    cellSize = 100
    col = 10
    row = 10

    init(game: IGame<ICreateParams>,
         frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>,
         actorToken: string,
         positionIndex: number,
         privatePrices: Array<number>) {
        this.game = game
        this.frameEmitter = frameEmitter
        this.actorToken = actorToken
        this.positionIndex = positionIndex
        this.privatePrices = privatePrices
    }

    get stageWidth() {
        return this.cellSize * this.col
    }

    get stageHeight() {
        return this.cellSize * this.row
    }

    span(n: number) {
        return this.cellSize * n
    }
}

