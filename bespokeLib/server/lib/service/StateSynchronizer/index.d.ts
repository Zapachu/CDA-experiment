import { IActor, SyncStrategy } from '@bespoke/share';
import { BaseController } from '../..';
import { GameStateSynchronizer, PlayerStateSynchronizer } from './BaseSynchronizer';
export { GameStateSynchronizer, PlayerStateSynchronizer };
export declare class StateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    private strategy;
    private controller;
    constructor(strategy: SyncStrategy, controller: BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>);
    getGameStateSynchronizer(): GameStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>;
    getPlayerStateSynchronizer(actor: IActor): PlayerStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>;
}
