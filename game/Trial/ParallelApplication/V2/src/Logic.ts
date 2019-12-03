import { BaseLogic, IActor, IMoveCallback, TGameState, TPlayerState } from '@bespoke/server'
import {
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  PushType,
  SceneName
} from './config'

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
    playerState.scene = SceneName.boot
    playerState.score = new Array(4).fill(null).map(() => ~~(Math.random() * 30) + 120)
    playerState.candidateNumber = Math.random()
      .toString()
      .slice(2, 8)
    return playerState
  }

  async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    const gameState = await this.stateManager.getGameState(),
      playerState = await this.stateManager.getPlayerState(actor)
    switch (type) {
      case MoveType.toChose:
        playerState.scene = SceneName.chose
        break
      case MoveType.toConfirm:
        playerState.applications = params.applications
        playerState.scene = SceneName.confirm
        break
      case MoveType.reChose:
        playerState.applications = []
        playerState.scene = SceneName.chose
        break
      case MoveType.toMatch:
        playerState.scene = SceneName.match
        global.setTimeout(() => {
          playerState.offer = ~~(Math.random() * 10)
          this.stateManager.syncState()
        }, 2e3)
        global.setTimeout(() => {
          playerState.scene = SceneName.result
          this.stateManager.syncState()
        }, 5e3)
        break
    }
  }
}
