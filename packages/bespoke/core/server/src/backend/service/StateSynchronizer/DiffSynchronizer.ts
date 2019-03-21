import {EventIO} from '../../util'
import {diff} from 'deep-diff'
import {baseEnum, TGameState, TPlayerState} from 'bespoke-common'
import {GameStateSynchronizer, PlayerStateSynchronizer} from './BaseSynchronizer'
import cloneDeep = require('lodash/cloneDeep')

export class DiffGameStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> extends GameStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    private stateSnapshot: TGameState<IGameState>

    async syncClientState(wholeState?: boolean) {
        const state = await this.getState(true)
        if (wholeState) {
            EventIO.emitEvent(this.controller.game.id, baseEnum.SocketEvent.syncGameState_json, cloneDeep(state))
        } else {
            EventIO.emitEvent(this.controller.game.id, baseEnum.SocketEvent.changeGameState_diff, diff(this.stateSnapshot || {}, state))
        }
        this.stateSnapshot = cloneDeep(state)
    }
}

export class DiffPlayerStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> extends PlayerStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    private stateSnapshot: TPlayerState<IPlayerState>

    async syncClientState(wholeState?: boolean) {
        const gameState = await this.controller.stateManager.getGameState()
        const state = await this.getState()
        if (wholeState) {
            const stateCopy = cloneDeep(state)
            EventIO.emitEvent(state.connectionId, baseEnum.SocketEvent.syncPlayerState_json, stateCopy)
            EventIO.emitEvent(gameState.connectionId, baseEnum.SocketEvent.syncPlayerState_json, stateCopy, this.actor.token)
        } else {
            const stateChanges = diff(this.stateSnapshot || {}, state)
            EventIO.emitEvent(state.connectionId, baseEnum.SocketEvent.changePlayerState_diff, stateChanges)
            EventIO.emitEvent(gameState.connectionId, baseEnum.SocketEvent.changePlayerState_diff, stateChanges, this.actor.token)
        }
        this.stateSnapshot = cloneDeep(state)
    }
}
