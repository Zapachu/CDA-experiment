import { IActor, SyncStrategy, TGameState, TPlayerState } from '@bespoke/share';
import { BaseLogic } from './BaseLogic';
export declare class StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    private logic;
    private gameStateManager;
    private playerStateManagers;
    private stateSynchronizer;
    constructor(strategy: SyncStrategy, logic: BaseLogic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>);
    getGameState(): Promise<TGameState<IGameState>>;
    private getPlayerManager;
    getPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>>;
    getPlayerStates(): Promise<{
        [token: string]: TPlayerState<IPlayerState>;
    }>;
    syncState(wholeState?: boolean): Promise<void>;
    syncWholeState2Player(actor: IActor): Promise<void>;
}
