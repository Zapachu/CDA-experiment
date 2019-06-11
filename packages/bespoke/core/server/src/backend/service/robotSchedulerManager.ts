import {EventIO, RobotConnection} from '../util'
import {decode} from 'msgpack-lite'
import {applyChange, Diff} from 'deep-diff'
import {baseEnum, FrameEmitter, IActor, IGameWithId, TGameState, TPlayerState} from 'bespoke-common'
import {BaseRobot} from './GameLogic'
import cloneDeep = require('lodash/cloneDeep')

export abstract class RobotScheduler<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    public id: string
    protected connection: RobotConnection
    gameState?: TGameState<IGameState> = null
    preGameState?: TGameState<IGameState> = null
    playerState?: TPlayerState<IPlayerState> = null
    prePlayerState?: TPlayerState<IPlayerState> = null

    private static geneConnectionId() {
        return `ROBOT_${Math.random().toString(36).substr(2)}`
    }

    constructor(public game: IGameWithId<ICreateParams>, public actor: IActor) {
        this.id = actor.token
    }

    async init(): Promise<RobotScheduler<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>> {
        this.connection = EventIO.robotConnect(RobotScheduler.geneConnectionId(), this.actor, this.game)
        this.connection.on(baseEnum.SocketEvent.syncGameState_json, (gameState: TGameState<IGameState>) => {
            this.preGameState = cloneDeep(this.gameState)
            this.gameState = cloneDeep(gameState)
            this.receiveGameState()
        })
        this.connection.on(baseEnum.SocketEvent.syncGameState_msgpack, (gameStateBuffer: Array<number>) => {
            this.preGameState = cloneDeep(this.gameState)
            this.gameState = cloneDeep(decode(gameStateBuffer))
            this.receiveGameState()
        })
        this.connection.on(baseEnum.SocketEvent.changeGameState_diff, (stateChanges: Array<Diff<IGameState>>) => {
            this.preGameState = cloneDeep(this.gameState)
            stateChanges.forEach(change => applyChange(this.gameState, null, change))
            this.receiveGameState()
        })
        this.connection.on(baseEnum.SocketEvent.syncPlayerState_json, (playerState: TPlayerState<IPlayerState>) => {
            this.prePlayerState = cloneDeep(this.playerState)
            this.playerState = cloneDeep(playerState)
            this.receivePlayerState()
        })
        this.connection.on(baseEnum.SocketEvent.syncPlayerState_msgpack, (playerStateBuffer: Array<number>) => {
            this.prePlayerState = cloneDeep(this.playerState)
            this.playerState = cloneDeep(decode(playerStateBuffer))
            this.receivePlayerState()
        })
        this.connection.on(baseEnum.SocketEvent.changePlayerState_diff, (stateChanges: Array<Diff<IPlayerState>>) => {
            this.prePlayerState = cloneDeep(this.playerState)
            stateChanges.forEach(change => applyChange(this.playerState, null, change))
            this.receivePlayerState()
        })
        return this
    }

    online(): RobotScheduler<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
        this.connection.emit(baseEnum.SocketEvent.online)
        return this
    }

    protected abstract receiveGameState()

    protected abstract receivePlayerState()
}

export class NodeRobotsScheduler<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> extends RobotScheduler<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    private robot: BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>
    frameEmitter: FrameEmitter<any, any, any, any>

    constructor(public game: IGameWithId<ICreateParams>, public actor: IActor, private RobotClass: typeof BaseRobot) {
        super(game, actor)
    }

    async init(): Promise<NodeRobotsScheduler<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>> {
        await super.init()
        this.frameEmitter = new FrameEmitter<any, any, any, any>(this.connection)
        this.robot = await new this.RobotClass(this).init()
        return this
    }

    protected receiveGameState() {
        this.robot.receiveGameState()
    }

    protected receivePlayerState() {
        this.robot.receivePlayerState()
    }
}