import {baseEnum, IActor} from 'bespoke-common'
import {BaseController, Log} from '../..'
import {GameStateSynchronizer, PlayerStateSynchronizer} from './BaseSynchronizer'
import {DiffGameStateSynchronizer, DiffPlayerStateSynchronizer} from './DiffSynchronizer'
import {MsgPackGameStateSynchronizer, MsgPackPlayerStateSynchronizer} from './MsgPackSynchronizer'

export {GameStateSynchronizer, PlayerStateSynchronizer}

const UNSUPPORTED_STRATEGY_WARNING = 'Unsupported State Synchronize Strategy'

export class StateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    constructor(
        private strategy: baseEnum.SyncStrategy,
        private controller: BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>
    ) {
    }

    getGameStateSynchronizer(): GameStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
        switch (this.strategy) {
            case baseEnum.SyncStrategy.default:
                return new GameStateSynchronizer(this.controller)
            case baseEnum.SyncStrategy.diff:
                return new DiffGameStateSynchronizer(this.controller)
            case baseEnum.SyncStrategy.msgPack:
                return new MsgPackGameStateSynchronizer(this.controller)
            default:
                Log.w(UNSUPPORTED_STRATEGY_WARNING)
        }
    }

    getPlayerStateSynchronizer(actor: IActor): PlayerStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
        switch (this.strategy) {
            case baseEnum.SyncStrategy.default:
                return new PlayerStateSynchronizer(actor, this.controller)
            case baseEnum.SyncStrategy.diff:
                return new DiffPlayerStateSynchronizer(actor, this.controller)
            case baseEnum.SyncStrategy.msgPack:
                return new MsgPackPlayerStateSynchronizer(actor, this.controller)
            default:
                Log.w(UNSUPPORTED_STRATEGY_WARNING)
        }
    }
}
