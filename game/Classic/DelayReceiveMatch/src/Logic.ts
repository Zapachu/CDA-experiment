import { Model } from '@bespoke/server'
import { IMoveCallback } from '@bespoke/share'
import { Group, Round } from '@extend/server'
import { GroupDecorator } from '@extend/share'
import { IPlayer, match } from './util/Match'
import {
  CONFIG,
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
  initGameState(): IRoundGameState {
    const gameState = super.initGameState()
    gameState.timeLeft = CONFIG.tradeSeconds
    gameState.allocation = []
    return gameState
  }

  async initPlayerState(index: number): Promise<IRoundPlayerState> {
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
    await this.stateManager.syncState()
    global.setTimeout(async () => await this.overCallback(), 5e3)
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
      gameRoundState = gameState.rounds[round],
      playerStates = await this.stateManager.getPlayerStates(),
      playerStatesArr = Object.values<GroupDecorator.TPlayerState<IGroupPlayerState>>(playerStates).sort(
        (p1, p2) => p1.index - p2.index
      )
    await Model.FreeStyleModel.create({
      game: this.gameId,
      key: `${this.groupIndex}_${round}`,
      data: playerStatesArr.map(({ user, index, rounds }) => {
        const { allocation } = gameRoundState,
          { sort } = rounds[round],
          privatePrices = this.params.roundsParams[round].privatePriceMatrix[index]
        return {
          user: user.stuNum,
          playerIndex: index + 1,
          sort: sort.map(i => i + 1).join('>'),
          good: allocation[index] + 1,
          goodPrice: privatePrices[allocation[index]]
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
