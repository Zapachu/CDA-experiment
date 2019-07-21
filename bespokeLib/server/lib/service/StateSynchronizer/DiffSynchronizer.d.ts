import { GameStateSynchronizer, PlayerStateSynchronizer } from './BaseSynchronizer';
export declare class DiffGameStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> extends GameStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    private stateSnapshot;
    syncClientState(wholeState?: boolean): Promise<void>;
}
export declare class DiffPlayerStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> extends PlayerStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    private stateSnapshot;
    syncClientState(wholeState?: boolean): Promise<void>;
}
