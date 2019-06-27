import {EventIO, gameId2PlayUrl, Token} from '../util'
import {
    Actor,
    CoreMove,
    GameStatus,
    IActor,
    IConnection,
    IGameWithId,
    IMoveCallback,
    SocketEvent,
    SyncStrategy,
    TGameState,
    TPlayerState
} from 'bespoke-core-share'
import {Log} from 'bespoke-server-util'
import {GameDAO} from './GameDAO'
import {StateManager} from './StateManager'
import {MoveQueue} from './MoveQueue'
import {RedisCall, SendBackPlayer, SetPhaseResult} from 'elf-protocol'

type AnyController = BaseController<any, any, any, any, any, any, any>

export interface ILogicTemplate {
    Controller: new(...args) => AnyController,
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
}

export class BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta = {}> {
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
            status: GameStatus.started
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

    async moveReducer(actor: IActor, type: MoveType | CoreMove, params: IMoveParams & { status: GameStatus }, cb: IMoveCallback): Promise<void> {
        this.moveQueue.push(actor, type, params, async () => {
            if (actor.type === Actor.owner) {
                switch (type) {
                    case CoreMove.switchGameStatus: {
                        const gameState = await this.stateManager.getGameState()
                        if (params.status === GameStatus.over) {
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
                await this.playerMoveReducer(actor, type as MoveType, params, cb)
            }
        })
    }

    protected async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        Log.i(actor.token, type, params, cb)
    }

    protected async teacherMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        Log.i(actor.token, type, params, cb)
    }

    async startRobot(key, meta?: IRobotMeta) {
        const actor: IActor = {token: Token.geneToken(`${this.game.id}${key}`), type: Actor.serverRobot}
        EventIO.socketRobotConnect<IRobotMeta>(`ROBOT_${Math.random().toString(36).substr(2)}`, actor, this.game, meta)
    }

    //region pushEvent
    protected push(actors: IActor | IActor[], type: PushType, params?: Partial<IPushParams>) {
        const _actors = Array.isArray(actors) ? actors : [actors]
        setTimeout(() => _actors.forEach(actor => {
            try {
                EventIO.emitEvent(this.connections.get(actor.token).id, SocketEvent.push, type, params)
            } catch (e) {
                Log.e(e)
            }
        }), 0)
    }

    protected broadcast(type: PushType, params?: Partial<IPushParams>) {
        setTimeout(() => EventIO.emitEvent(this.game.id, SocketEvent.push, type, params), 0)
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
                EventIO.emitEvent(this.connections.get(playerToken).id, SocketEvent.sendBack, sendBackUrl))
    }

    //endregion
}