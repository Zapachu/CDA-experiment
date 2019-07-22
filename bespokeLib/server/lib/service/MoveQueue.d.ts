import { QueueWorker } from 'queue';
import { CoreMove, IActor, IGameWithId } from '@bespoke/share';
import { StateManager } from './StateManager';
export declare class MoveQueue<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    private game;
    private stateManager;
    private seq;
    private gameState;
    private playerStates;
    private queue;
    constructor(game: IGameWithId<ICreateParams>, stateManager: StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>);
    push(actor: IActor, type: MoveType | CoreMove, params: IMoveParams, moveHandler: QueueWorker): void;
}
