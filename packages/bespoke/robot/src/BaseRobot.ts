import {EventEmitter} from 'events'
import {applyChange, Diff} from 'deep-diff'
import {FrameEmitter, IActor, IGameWithId, SocketEvent, TGameState, TPlayerState} from 'bespoke-core-share'
import {Log} from 'bespoke-server-util'
import cloneDeep = require('lodash/cloneDeep')

export type AnyRobot = BaseRobot<any, any, any, any, any, any, any>

export class BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta = {}> {
    private preGameState?: TGameState<IGameState> = null
    private prePlayerState?: TPlayerState<IPlayerState> = null
    frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
    gameState?: TGameState<IGameState> = null
    playerState?: TPlayerState<IPlayerState> = null

    constructor(public game: IGameWithId<ICreateParams>, public actor: IActor, public connection: EventEmitter, public meta?: IRobotMeta) {
        this.connection
            .on(SocketEvent.syncGameState_json, (gameState: TGameState<IGameState>) => {
                this.preGameState = cloneDeep(this.gameState)
                this.gameState = cloneDeep(gameState)
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
            .on(SocketEvent.changePlayerState_diff, (stateChanges: Array<Diff<IPlayerState>>) => {
                Log.l(this.prePlayerState)
                this.prePlayerState = cloneDeep(this.playerState)
                stateChanges.forEach(change => applyChange(this.playerState, null, change))
            })
        this.frameEmitter = new FrameEmitter<any, any, any, any>(this.connection)
    }

    async init(): Promise<this> {
        Log.i('RobotInit', this.actor.token, this.meta)
        return this
    }
}