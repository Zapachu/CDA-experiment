import {elfPhaseId2PlayUrl, EventIO, Hash, Log} from '../util'
import {
    baseEnum,
    FrameEmitter,
    IActor,
    IConnection,
    IGameWithId,
    IMoveCallback,
    TGameState,
    TPlayerState
} from 'bespoke-common'
import GameDAO from './GameDAO'
import {NodeRobotsScheduler, PythonSchedulerProxy, RobotScheduler} from './robotSchedulerManager'
import {StateManager} from './StateManager'
import {MoveQueue} from './MoveQueue'
import {Request, Response} from 'express'
import {getGameService} from '../rpc'
import SyncStrategy = baseEnum.SyncStrategy
import {PhaseManager} from 'elf-protocol'

export type AnyController = BaseController<any, any, any, any, any, any, any, any>
type AnyRobotScheduler = RobotScheduler<any, any, any, any, any, any, any>
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

    const gameControllers = new Map<string, AnyController>()

    export async function getGameController(gameId: string): Promise<AnyController> {
        if (!gameControllers.get(gameId)) {
            const game = await GameDAO.getGame(gameId)
            gameControllers.set(gameId, await new template.Controller(game).init())
        }
        return gameControllers.get(gameId)
    }

    const robotSchedulers = new Map<string, AnyRobotScheduler>()

    export async function startNewRobotScheduler<ICreateParams, IGameState, IPlayerState>(gameId: string, key: string, pythonRobot: boolean): Promise<void> {
        const game = await GameDAO.getGame<ICreateParams>(gameId)
        const actor: IActor = {
            token: Hash.hashObj(`${game.id}${key}`),
            type: baseEnum.Actor.serverRobot
        }
        const robotProxy = await (pythonRobot ? new PythonSchedulerProxy(game, actor) : new NodeRobotsScheduler(game, actor, template.Robot)).init()
        robotSchedulers.set(robotProxy.id, robotProxy)
    }
}

export class BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    private moveQueue: MoveQueue<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>
    public connections = new Map<string, IConnection>()
    stateManager: StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>

    constructor(public game?: IGameWithId<ICreateParams>) {
    }

    async init() {
        this.stateManager = new StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>(GameLogic.sncStrategy, this)
        this.moveQueue = new MoveQueue(this.game, this.stateManager)
        return this
    }

    getGame4Player() {
        return this.game
    }

    initGameState(): TGameState<IGameState> {
        return {
            status: baseEnum.GameStatus.notStarted
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
                        switch (params.status) {
                            case baseEnum.GameStatus.over:
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
    }

    protected async teacherMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    }

    async startNewRobotScheduler(key, pythonRobot: boolean) {
        await GameLogic.startNewRobotScheduler(this.game.id, key, pythonRobot)
    }

    async handleFetch(req: Request, res: Response) {
        res.json({
            code: baseEnum.ResponseCode.success
        })
    }

    //region pushEvent
    protected push(actors: IActor | IActor[], type: PushType, params?: IPushParams) {
        const _actors = Array.isArray(actors) ? actors : [actors]
        setTimeout(() => _actors.forEach(actor => {
            try {
                EventIO.emitEvent(this.connections.get(actor.token).id, baseEnum.SocketEvent.push, type, params)
            } catch (e) {
                Log.e(e)
            }
        }), 0)
    }

    protected broadcast(type: PushType, params?: IPushParams) {
        setTimeout(() => EventIO.emitEvent(this.game.id, baseEnum.SocketEvent.push, type, params), 0)
    }

    //endregion

    //region elf
    protected sendBackPlayer(playerToken: string, phaseResult?:PhaseManager.TPhasePlayer, nextPhaseKey?: string) {
        if (!this.game.groupId) {
            return Log.w('Bespoke单独部署，game未关联至Elf group')
        }
        getGameService().sendBackPlayer({
            playUrl: elfPhaseId2PlayUrl(this.game.namespace, this.game.id),
            playerToken,
            nextPhaseKey,
            groupId: this.game.groupId,
            phasePlayer:phaseResult
        }, (err, res) => {
            if (err) {
                return Log.e(err)
            }
            EventIO.emitEvent(this.connections.get(playerToken).id, baseEnum.SocketEvent.sendBack, res.sendBackUrl)
        })
    }

    //endregion
}

export class BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    constructor(private nodeRobotsScheduler: NodeRobotsScheduler<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
    }

    async init(): Promise<BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>> {
        return this
    }

    get game(): IGameWithId<ICreateParams> {
        return this.nodeRobotsScheduler.game
    }

    get gameState(): TGameState<IGameState> {
        return this.nodeRobotsScheduler.gameState
    }

    get playerState(): TPlayerState<IPlayerState> {
        return this.nodeRobotsScheduler.playerState
    }

    get frameEmitter(): FrameEmitter<MoveType, PushType, IMoveParams, IPushParams> {
        return this.nodeRobotsScheduler.frameEmitter
    }

    receiveGameState(): void {
    }

    receivePlayerState(): void {
    }
}
