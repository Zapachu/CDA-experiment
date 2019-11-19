import { BaseController, IActor, IMoveCallback, TGameState, TPlayerState } from '@bespoke/server'
import {
  getAncademyId,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  PushType
} from './config'

export class Controller extends BaseController<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  initGameState(): TGameState<IGameState> {
    const gameState = super.initGameState()
    gameState.playerIndex = 0
    return gameState
  }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const playerState = super.initPlayerState(actor)
    return playerState
  }

  protected async playerMoveReducer(
    actor: IActor,
    type: MoveType,
    params: IMoveParams,
    cb: IMoveCallback
  ): Promise<void> {
    const gameState = await this.stateManager.getGameState(),
      playerState = await this.stateManager.getPlayerState(actor)
    switch (type) {
      case MoveType.getIndex:
        if (playerState.playerIndex !== undefined) {
          break
        }
        playerState.playerIndex = ++gameState.playerIndex
        this.setPhaseResult(playerState.actor.token, {
          uniKey: getAncademyId(playerState.actor.token, playerState.playerIndex)
        })
    }
  }
}
