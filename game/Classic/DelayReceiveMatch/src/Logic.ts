import { Model } from '@bespoke/server'
import { IMoveCallback } from '@bespoke/share'
import { Group, Round } from '@extend/server'
import { RoundDecorator } from '@extend/share'
import { IPlayer, match } from './util/Match'
import {
  IGroupCreateParams,
  IGroupGameState,
  IGroupMoveParams,
  IGroupPlayerState,
  IPushParams,
  IRoundCreateParams,
  IRoundGameState,
  IRoundMoveParams,
  IRoundPlayerState,
  PlayerRoundStatus,
  PushType,
  RoundMoveType
} from './config'

class RoundLogic extends Round.Round.Logic<
  IRoundCreateParams,
  IRoundGameState,
  IRoundPlayerState,
  RoundMoveType,
  PushType,
  IRoundMoveParams,
  IPushParams
> {
  initGameState(): RoundDecorator.TRoundGameState<IRoundGameState> {
    const gameState = super.initGameState()
    gameState.allocation = []
    return gameState
  }

  async initPlayerState(index: number): Promise<RoundDecorator.TRoundPlayerState<IRoundPlayerState>> {
    const playerState = await super.initPlayerState(index)
    playerState.status = PlayerRoundStatus.play
    playerState.sort = []
    return playerState
  }

  async roundOver() {
    const gameState = await this.stateManager.getGameState(),
      playerStates = await this.stateManager.getPlayerStates()
    const players: IPlayer[] = playerStates.map(({ sort }) => ({ sort }))
    gameState.allocation = match(players)
    playerStates.forEach(p => (p.status = PlayerRoundStatus.result))
    await this.overCallback()
  }

  async playerMoveReducer(
    index: number,
    type: RoundMoveType,
    params: IRoundMoveParams,
    cb: IMoveCallback
  ): Promise<void> {
    const playerState = await this.stateManager.getPlayerState(index),
      playerStates = await this.stateManager.getPlayerStates()
    switch (type) {
      case RoundMoveType.submit:
        playerState.status = PlayerRoundStatus.wait
        playerState.sort = params.sort
        if (playerStates.every(p => p.status === PlayerRoundStatus.wait)) {
          await this.roundOver()
        }
        break
    }
  }
}

class GroupLogic extends Round.Logic<
  IRoundCreateParams,
  IRoundGameState,
  IRoundPlayerState,
  RoundMoveType,
  PushType,
  IRoundMoveParams,
  IPushParams
> {
  RoundLogic = RoundLogic

  async roundOverCallback(): Promise<any> {
    const gameState = await this.stateManager.getGameState(),
      { round } = gameState,
      { allocation } = gameState.rounds[round],
      playerStates = await this.stateManager.getPlayerStates()
    await Model.FreeStyleModel.create({
      game: this.gameId,
      key: `${this.groupIndex}_${round}`,
      data: playerStates.map(({ user, index: indexInGroup, rounds }) => {
        const { sort, index: indexInRound } = rounds[round],
          privatePrices = this.params.roundsParams[round].privatePriceMatrix[indexInGroup]
        return {
          userName: user.name,
          stuNum: user.stuNum,
          indexInGroup: indexInGroup + 1,
          indexInRound: indexInRound + 1,
          privatePrices: privatePrices.join(' , '),
          sort: sort.map(i => String.fromCharCode(65 + i)).join('>'),
          good: String.fromCharCode(65 + allocation[indexInRound]),
          goodPrice: privatePrices[allocation[indexInRound]]
        }
      })
    })
  }
}

export class Logic extends Group.Logic<
  IGroupCreateParams,
  IGroupGameState,
  IGroupPlayerState,
  RoundMoveType,
  PushType,
  IGroupMoveParams,
  IPushParams
> {
  GroupLogic = GroupLogic
}
