import {EventIO, gameId2PlayUrl, Log, RobotConnection, Token} from '../util'
import {
    baseEnum,
    FrameEmitter,
    IActor,
    IConnection,
    IGameWithId,
    IMoveCallback,
    TGameState,
    TPlayerState
} from 'bespoke-core-share'
import {GameDAO} from './GameDAO'
import {StateManager} from './StateManager'
import {MoveQueue} from './MoveQueue'
import {RedisCall, SendBackPlayer, SetPhaseResult} from 'elf-protocol'
import {decode} from 'msgpack-lite'
import {applyChange, Diff} from 'deep-diff'
import cloneDeep = require('lodash/cloneDeep')
import SyncStrategy = baseEnum.SyncStrategy

type AnyController = BaseController<any, any, any, any, any, any, any>
type AnyRobot = BaseRobot<any, any, any, any, any, any, any>

export interface ILogicTemplate {
    Controller: new(...args) => AnyController,
    Robot?: new(...args) => AnyRobot
    sncStrategy?: SyncStrategy
}

export namespace GameLogic {
    let template: ILogicTemplate
    export let sncStrategy: SyncStrategy

    export let namespaceController: AnyController

    export function init(logicTemplate: ILogicTemplate) {
        template = logicTemplate
        sncStrategy = logicTemplate.sncStrategy || SyncStrategy.default
        namespaceController = new template.Controller()
    }

    const controllers = new Map<string, AnyController>()

    export async function getGameController(gameId: string): Promise<AnyController> {
        if (!controllers.get(gameId)) {
            const game = await GameDAO.getGame(gameId)
            controllers.set(gameId, await new template.Controller(game).init())
        }
        return controllers.get(gameId)
    }

    const robots = new Map<string, AnyRobot>()

    export async function startRobot<ICreateParams, IGameState, IPlayerState>(gameId: string, key: string): Promise<void> {
        const actor: IActor = {
            token: Token.geneToken(`${gameId}${key}`),
            type: baseEnum.Actor.serverRobot
        }
        if (robots.has(actor.token)) {
            return
        }
        const game = await GameDAO.getGame<ICreateParams>(gameId)
        robots.set(actor.token, await new template.Robot(game, actor).init())
    }
}

export class BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    private moveQueue: MoveQueue<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>
    public connections = new Map<string, IConnection>()
    stateManager: StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>

    constructor(public game?: IGameWithId<ICreateParams>) {
    }

    async init() {
        this.stateManager = new StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>(GameLogic.sncStrategy, this)
        this.moveQueue = new MoveQueue(this.game, this.stateManager)
        return this
    }

    getGame4Player() {
        return this.game
    }

    initGameState(): TGameState<IGameState> {
        return {
            status: baseEnum.GameStatus.started
        } as any
    }

    filterGameState(gameState: TGameState<IGameState>): any {
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        return {
            actor
        } as any
    }

    async onGameOver(): Promise<void> {
    }

    async moveReducer(actor: IActor, type: string, params: IMoveParams & { status: baseEnum.GameStatus }, cb: IMoveCallback): Promise<void> {
        this.moveQueue.push(actor, type, params, async () => {
            if (actor.type === baseEnum.Actor.owner) {
                switch (type) {
                    case baseEnum.CoreMove.switchGameStatus: {
                        const gameState = await this.stateManager.getGameState()
                        if (params.status === baseEnum.GameStatus.over) {
                            await this.onGameOver()
                        }
                        gameState.status = params.status
                        break
                    }
                    default: {
                        await this.teacherMoveReducer(actor, type, params, cb)
                    }
                }
            } else {
                await this.playerMoveReducer(actor, type, params, cb)
            }
        })
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        Log.i(actor.token, type, params, cb)
    }

    protected async teacherMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        Log.i(actor.token, type, params, cb)
    }

    async startRobot(key) {
        await GameLogic.startRobot(this.game.id, key)
    }

    //region pushEvent
    protected push(actors: IActor | IActor[], type: PushType, params?: Partial<IPushParams>) {
        const _actors = Array.isArray(actors) ? actors : [actors]
        setTimeout(() => _actors.forEach(actor => {
            try {
                EventIO.emitEvent(this.connections.get(actor.token).id, baseEnum.SocketEvent.push, type, params)
            } catch (e) {
                Log.e(e)
            }
        }), 0)
    }

    protected broadcast(type: PushType, params?: Partial<IPushParams>) {
        setTimeout(() => EventIO.emitEvent(this.game.id, baseEnum.SocketEvent.push, type, params), 0)
    }

    //endregion

    //region elf
    protected setPhaseResult(playerToken: string, phaseResult: SetPhaseResult.IPhaseResult) {
        if (!this.game.elfGameId) {
            return Log.w('Bespoke单独部署，game未关联至Elf group')
        }
        RedisCall.call<SetPhaseResult.IReq, SetPhaseResult.IRes>(SetPhaseResult.name, {
            playUrl: gameId2PlayUrl(this.game.id),
            playerToken,
            elfGameId: this.game.elfGameId,
            phaseResult
        }).catch(e => Log.e(e))
    }

    protected sendBackPlayer(playerToken: string, phaseResult?: SetPhaseResult.IPhaseResult, nextPhaseKey?: string) {
        if (!this.game.elfGameId) {
            return Log.w('Bespoke单独部署，game未关联至Elf group')
        }
        RedisCall.call<SendBackPlayer.IReq, SendBackPlayer.IRes>(SendBackPlayer.name, {
            playUrl: gameId2PlayUrl(this.game.id),
            playerToken,
            elfGameId: this.game.elfGameId,
            phaseResult,
            nextPhaseKey
        })
            .catch(e => Log.e(e))
            .then(({sendBackUrl}) =>
                EventIO.emitEvent(this.connections.get(playerToken).id, baseEnum.SocketEvent.sendBack, sendBackUrl))
    }

    //endregion
}

export class BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    private readonly connection: RobotConnection
    private preGameState?: TGameState<IGameState> = null
    private prePlayerState?: TPlayerState<IPlayerState> = null
    frameEmitter: FrameEmitter<any, any, any, any>
    gameState?: TGameState<IGameState> = null
    playerState?: TPlayerState<IPlayerState> = null

    constructor(public game: IGameWithId<ICreateParams>, public actor: IActor) {
        this.connection = EventIO.robotConnect(`ROBOT_${Math.random().toString(36).substr(2)}`, this.actor, this.game)
            .on(baseEnum.SocketEvent.syncGameState_json, (gameState: TGameState<IGameState>) => {
                this.preGameState = cloneDeep(this.gameState)
                this.gameState = cloneDeep(gameState)
            })
            .on(baseEnum.SocketEvent.syncGameState_msgpack, (gameStateBuffer: Array<number>) => {
                this.preGameState = cloneDeep(this.gameState)
                this.gameState = cloneDeep(decode(gameStateBuffer))
            })
            .on(baseEnum.SocketEvent.changeGameState_diff, (stateChanges: Array<Diff<IGameState>>) => {
                Log.d(this.preGameState)
                this.preGameState = cloneDeep(this.gameState)
                stateChanges.forEach(change => applyChange(this.gameState, null, change))
            })
            .on(baseEnum.SocketEvent.syncPlayerState_json, (playerState: TPlayerState<IPlayerState>) => {
                this.prePlayerState = cloneDeep(this.playerState)
                this.playerState = cloneDeep(playerState)
            })
            .on(baseEnum.SocketEvent.syncPlayerState_msgpack, (playerStateBuffer: Array<number>) => {
                this.prePlayerState = cloneDeep(this.playerState)
                this.playerState = cloneDeep(decode(playerStateBuffer))
            })
            .on(baseEnum.SocketEvent.changePlayerState_diff, (stateChanges: Array<Diff<IPlayerState>>) => {
                Log.d(this.prePlayerState)
                this.prePlayerState = cloneDeep(this.playerState)
                stateChanges.forEach(change => applyChange(this.playerState, null, change))
            })
        this.frameEmitter = new FrameEmitter<any, any, any, any>(this.connection)
    }

    async init(): Promise<BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>> {
        this.connection.emit(baseEnum.SocketEvent.online)
        return this
    }
}
