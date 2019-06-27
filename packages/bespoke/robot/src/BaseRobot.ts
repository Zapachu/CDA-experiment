import {EventEmitter} from 'events'
import {decode} from 'msgpack-lite'
import {applyChange, Diff} from 'deep-diff'
import {FrameEmitter, IActor, IGameWithId, SocketEvent, TGameState, TPlayerState} from 'bespoke-core-share'
import {Log} from 'bespoke-server-util'
import cloneDeep = require('lodash/cloneDeep')

export class BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    private preGameState?: TGameState<IGameState> = null
    private prePlayerState?: TPlayerState<IPlayerState> = null
    frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
    gameState?: TGameState<IGameState> = null
    playerState?: TPlayerState<IPlayerState> = null

    constructor(public game: IGameWithId<ICreateParams>, public actor: IActor, public connection: EventEmitter) {
        this.connection
            .on(SocketEvent.syncGameState_json, (gameState: TGameState<IGameState>) => {
                this.preGameState = cloneDeep(this.gameState)
                this.gameState = cloneDeep(gameState)
            })
            .on(SocketEvent.syncGameState_msgpack, (gameStateBuffer: Array<number>) => {
                this.preGameState = cloneDeep(this.gameState)
                this.gameState = cloneDeep(decode(gameStateBuffer))
            })
            .on(SocketEvent.changeGameState_diff, (stateChanges: Array<Diff<IGameState>>) => {
                Log.l(this.preGameState)
                this.preGameState = cloneDeep(this.gameState)
                stateChanges.forEach(change => applyChange(this.gameState, null, change))
            })
            .on(SocketEvent.syncPlayerState_json, (playerState: TPlayerState<IPlayerState>) => {
                this.prePlayerState = cloneDeep(this.playerState)
                this.playerState = cloneDeep(playerState)
            })
            .on(SocketEvent.syncPlayerState_msgpack, (playerStateBuffer: Array<number>) => {
                this.prePlayerState = cloneDeep(this.playerState)
                this.playerState = cloneDeep(decode(playerStateBuffer))
            })
            .on(SocketEvent.changePlayerState_diff, (stateChanges: Array<Diff<IPlayerState>>) => {
                Log.l(this.prePlayerState)
                this.prePlayerState = cloneDeep(this.playerState)
                stateChanges.forEach(change => applyChange(this.playerState, null, change))
            })
        this.frameEmitter = new FrameEmitter<any, any, any, any>(this.connection)
    }

    async init(): Promise<BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>> {
        this.connection.emit(SocketEvent.online)
        return this
    }
}