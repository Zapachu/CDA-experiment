import { BaseLogic, IActor, IMoveCallback, TGameState, TPlayerState } from '@bespoke/server'
import { ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType } from './config'

export class Logic extends BaseLogic<
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
    return gameState
  }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const playerState = await super.initPlayerState(actor)
    return playerState
  }

  async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    const gameState = await this.stateManager.getGameState(),
      playerState = await this.stateManager.getPlayerState(actor)
    switch (type) {
    }
  }
}
