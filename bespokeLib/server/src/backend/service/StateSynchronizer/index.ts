import {IActor, SyncStrategy} from '@bespoke/share'
import {Log} from '@elf/util'
import {BaseController} from '../..'
import {GameStateSynchronizer, PlayerStateSynchronizer} from './BaseSynchronizer'
import {DiffGameStateSynchronizer, DiffPlayerStateSynchronizer} from './DiffSynchronizer'

export {GameStateSynchronizer, PlayerStateSynchronizer}

const UNSUPPORTED_STRATEGY_WARNING = 'Unsupported State Synchronize Strategy'

export class StateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    constructor(
        private strategy: SyncStrategy,
        private controller: BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>
    ) {
    }

    getGameStateSynchronizer(): GameStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
        switch (this.strategy) {
            case SyncStrategy.default:
                return new GameStateSynchronizer(this.controller)
            case SyncStrategy.diff:
                return new DiffGameStateSynchronizer(this.controller)
            default:
                Log.w(UNSUPPORTED_STRATEGY_WARNING)
        }
    }

    getPlayerStateSynchronizer(actor: IActor): PlayerStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
        switch (this.strategy) {
            case SyncStrategy.default:
                return new PlayerStateSynchronizer(actor, this.controller)
            case SyncStrategy.diff:
                return new DiffPlayerStateSynchronizer(actor, this.controller)
            default:
                Log.w(UNSUPPORTED_STRATEGY_WARNING)
        }
    }
}
