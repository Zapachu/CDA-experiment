import {baseEnum} from 'bespoke-core-share'
import {encode} from 'msgpack-lite'
import {GameStateSynchronizer, PlayerStateSynchronizer} from './BaseSynchronizer'
import {EventIO, Log} from '../../util'

export class MsgPackGameStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> extends GameStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    async syncClientState(wholeState?: boolean) {
        const state = await this.getState(true)
        Log.l(JSON.stringify(state).length/encode(state).length)
        EventIO.emitEvent(this.controller.game.id, baseEnum.SocketEvent.syncGameState_msgpack, [...encode(state)])
    }
}

export class MsgPackPlayerStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> extends PlayerStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    async syncClientState(wholeState?: boolean) {
        const gameState = await this.controller.stateManager.getGameState()
        const state = await this.getState()
        EventIO.emitEvent(state.connectionId, baseEnum.SocketEvent.syncPlayerState_msgpack, [...encode(state)])
        EventIO.emitEvent(gameState.connectionId, baseEnum.SocketEvent.syncPlayerState_msgpack, [...encode(state)], this.actor.token)
    }
}
