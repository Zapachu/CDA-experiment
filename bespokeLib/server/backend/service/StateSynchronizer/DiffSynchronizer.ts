import { diff } from 'deep-diff'
import { SocketEvent, TGameState, TPlayerState } from '@bespoke/share'
import { GameStateSynchronizer, PlayerStateSynchronizer } from './BaseSynchronizer'
import { EventIO } from '../EventIO'
import cloneDeep = require('lodash/cloneDeep')

export class DiffGameStateSynchronizer<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> extends GameStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
  private stateSnapshot: TGameState<IGameState>

  async syncClientState(wholeState?: boolean) {
    const state = await this.getState(true)
    if (wholeState) {
      EventIO.emitEvent(this.logic.game.id, SocketEvent.syncGameState_json, cloneDeep(state))
    } else {
      EventIO.emitEvent(this.logic.game.id, SocketEvent.changeGameState_diff, diff(this.stateSnapshot || {}, state))
    }
    this.stateSnapshot = cloneDeep(state)
  }
}

export class DiffPlayerStateSynchronizer<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> extends PlayerStateSynchronizer<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  private stateSnapshot: TPlayerState<IPlayerState>

  async syncClientState(wholeState?: boolean) {
    const gameState = await this.controller.stateManager.getGameState()
    const state = await this.getState()
    if (wholeState) {
      const stateCopy = cloneDeep(state)
      EventIO.emitEvent(state.connectionId, SocketEvent.syncPlayerState_json, stateCopy)
      EventIO.emitEvent(gameState.connectionId, SocketEvent.syncPlayerState_json, stateCopy, this.actor.token)
    } else {
      const stateChanges = diff(this.stateSnapshot || {}, state)
      EventIO.emitEvent(state.connectionId, SocketEvent.changePlayerState_diff, stateChanges)
      EventIO.emitEvent(gameState.connectionId, SocketEvent.changePlayerState_diff, stateChanges, this.actor.token)
    }
    this.stateSnapshot = cloneDeep(state)
  }
}
