import { IActor, TGameState, TPlayerState } from '@bespoke/share';
import { BaseLogic } from '../BaseLogic';
export declare class GameStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    protected logic: BaseLogic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>;
    private _state;
    private _stateSnapshot;
    constructor(logic: BaseLogic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>);
    getState(forClient: boolean): Promise<TGameState<IGameState>>;
    syncState(wholeState?: boolean): Promise<void>;
    syncClientState(wholeState?: boolean): Promise<void>;
}
export declare class PlayerStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    actor: IActor;
    protected controller: BaseLogic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>;
    private _state;
    private _stateSnapshot;
    constructor(actor: IActor, controller: BaseLogic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>);
    getState(): Promise<TPlayerState<IPlayerState>>;
    syncState(wholeState?: boolean): Promise<void>;
    syncClientState(wholeState?: boolean): Promise<void>;
}
