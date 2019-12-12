import { Group } from '@extend/server'
import { IMoveCallback, IUserWithId } from '@bespoke/share'
import { Log } from '@elf/util'
import { ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType } from './config'
import { GroupDecorator } from '@extend/share'

class GroupLogic extends Group.Group.Logic<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  initGameState(): IGameState {
    const gameState = super.initGameState()
    gameState.total = 0
    return gameState
  }

  async initPlayerState(
    user: IUserWithId,
    groupIndex: number,
    index: number
  ): Promise<GroupDecorator.TPlayerState<IPlayerState>> {
    const playerState = await super.initPlayerState(user, groupIndex, index)
    playerState.count = 0
    return playerState
  }

  async teacherMoveReducer(type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    const gameState = await this.stateManager.getGameState()
    Log.d(gameState)
    switch (type) {
      case MoveType.reset:
        gameState.total = 0
    }
  }

  async playerMoveReducer(index: number, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    const gameState = await this.stateManager.getGameState(),
      playerState = await this.stateManager.getPlayerState(index)
    switch (type) {
      case MoveType.add:
        playerState.count++
        gameState.total++
    }
  }
}

export class Logic extends Group.Logic<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  GroupLogic = GroupLogic
}
