import { CoreMove, GameStatus, IActor, IConnection, IGameWithId, IMoveCallback, SyncStrategy, TGameState, TPlayerState } from '@bespoke/share';
import { Linker } from '@elf/protocol';
import { StateManager } from './StateManager';
export declare type AnyLogic = BaseLogic<any, any, any, any, any, any, any>;
export declare class BaseLogic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta = {}> {
    game?: IGameWithId<ICreateParams>;
    private static sncStrategy;
    private static Controller;
    private static controllers;
    static init(Controller: new (...args: any[]) => AnyLogic, sncStrategy?: SyncStrategy): void;
    static getLogic(gameId: string): Promise<AnyLogic>;
    private moveQueue;
    connections: Map<string, IConnection>;
    stateManager: StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>;
    constructor(game?: IGameWithId<ICreateParams>);
    init(): this;
    getGame4Player(): IGameWithId<ICreateParams>;
    initGameState(): TGameState<IGameState>;
    filterGameState(gameState: TGameState<IGameState>): any;
    initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>>;
    onGameOver(): Promise<void>;
    moveReducer(actor: IActor, type: MoveType | CoreMove, params: IMoveParams & {
        status: GameStatus;
    }, cb: IMoveCallback): Promise<void>;
    protected playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void>;
    protected teacherMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void>;
    startRobot(key: any, meta?: IRobotMeta): Promise<void>;
    protected push(actors: IActor | IActor[], type: PushType, params?: Partial<IPushParams>): void;
    protected broadcast(type: PushType, params?: Partial<IPushParams>): void;
    protected setPhaseResult(playerToken: string, result: Linker.Result.IResult): import("tracer").Tracer.LogOutput;
}
export { StateManager };
