import {Log, EventIO, RobotConnection, cacheResultSync} from '@server-util'
import * as path from 'path'
import {credentials, load as grpcLoad, loadPackageDefinition} from 'grpc'
import {loadSync} from '@grpc/proto-loader'
import cloneDeep = require('lodash/cloneDeep')
import {applyChange, Diff} from 'deep-diff'
import {
    baseEnum,
    IActor,
    TGameState,
    IGameWithId,
    TPlayerState,
    FrameEmitter
} from '@common'
import {setting} from '@server-util'
import {BaseRobot} from '../index'

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
        this.connection.on(baseEnum.SocketEvent.syncGameState, (gameState: TGameState<IGameState>) => {
            this.preGameState = cloneDeep(this.gameState)
            this.gameState = cloneDeep(gameState)
            this.receiveGameState()
        })
        this.connection.on(baseEnum.SocketEvent.changeGameState, (stateChanges: Array<Diff<IGameState>>) => {
            this.preGameState = cloneDeep(this.gameState)
            stateChanges.forEach(change => applyChange(this.gameState, null, change))
            this.receiveGameState()
        })
        this.connection.on(baseEnum.SocketEvent.syncPlayerState, (playerState: TPlayerState<IPlayerState>) => {
            this.prePlayerState = cloneDeep(this.playerState)
            this.playerState = cloneDeep(playerState)
            this.receivePlayerState()
        })
        this.connection.on(baseEnum.SocketEvent.changePlayerState, (stateChanges: Array<Diff<IPlayerState>>) => {
            this.prePlayerState = cloneDeep(this.playerState)
            stateChanges.forEach(change => applyChange(this.playerState, null, change))
            this.receivePlayerState()
        })
        setTimeout(() => this.connection.emit(baseEnum.SocketEvent.online), Math.random() * 1000)
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

export class PythonSchedulerProxy<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> extends RobotScheduler<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    private syncStateStream: any

    @cacheResultSync
    loadBespokePlayChannel(namespace: string): {
        syncStateStream: any
        moveStream: any
    } {
        const {PlayChannel} = grpcLoad(`${__dirname}/../../../../dist/${namespace}.proto`)[namespace] as any
        const playChannel = new PlayChannel(setting.pythonRobotUri, credentials.createInsecure())
        const syncStateStream = playChannel.syncState(() => {
            }),
            moveStream = playChannel.sendMove()
        return {syncStateStream, moveStream}
    }

    async init() {
        await super.init()
        const game = (({id, owner, namespace}: IGameWithId<ICreateParams>) => ({
            id,
            owner: owner.toString(),
            namespace
        }))(this.game)
        const {RobotManager} = loadPackageDefinition(loadSync(path.resolve(__dirname, `../../../../robot/core/proto/RobotManager.proto`))) as any,
            robotManager = new RobotManager(setting.pythonRobotUri, credentials.createInsecure())
        robotManager.newRobot({
            game,
            moveTypes: []
        }, err => {
            err ? Log.l(err) : null
        })
        const {syncStateStream, moveStream} = this.loadBespokePlayChannel(this.game.namespace)
        this.syncStateStream = syncStateStream
        moveStream.on('data', ({token, type, params}) => {
            if (token !== this.actor.token) {
                return
            }
            this.connection.emit(baseEnum.SocketEvent.move, {
                type,
                params,
                logStack: {
                    startTime: 0,
                    logs: [],
                    submitTime: 0
                }
            })
        })
        return this
    }

    protected receiveGameState() {
        this.writeStateStream()
    }

    protected receivePlayerState() {
        this.writeStateStream()
    }

    private writeStateStream() {
        try {
            this.syncStateStream.write(JSON.parse(JSON.stringify({
                gameState: this.gameState,
                playerState: this.playerState
            })))
        } catch (e) {
            Log.e(e)
        }
    }
}