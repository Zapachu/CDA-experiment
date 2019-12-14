import { Group, Round } from '@extend/server'
import { IMoveCallback } from '@bespoke/share'
import {
  GoodStatus,
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
import { Model } from '@bespoke/server'
import { IPlayer, match } from './util/Match'
import shuffle = require('lodash/shuffle')

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
    const { oldPlayer, privatePriceMatrix } = this.params,
      groupSize = privatePriceMatrix.length
    const gameState = super.initGameState()
    const goodStatus = [...Array(oldPlayer).fill(GoodStatus.old), ...Array(groupSize - oldPlayer).fill(GoodStatus.new)],
      initAllocation = shuffle(goodStatus.map((s, i) => (s === GoodStatus.new ? null : i)))
    gameState.goodStatus = goodStatus
    gameState.initAllocation = initAllocation
    gameState.overPrePlay = initAllocation.map(a => a === null)
    gameState.allocation = []
    return gameState
  }

  async initPlayerState(index: number): Promise<IRoundPlayerState> {
    const playerState = await super.initPlayerState(index)
    playerState.status = PlayerRoundStatus.prePlay
    playerState.sort = []
    return playerState
  }

  async roundOver() {
    const gameState = await this.stateManager.getGameState(),
      playerStates = await this.stateManager.getPlayerStates()
    const players: IPlayer[] = playerStates.map(({ sort }) => ({ sort }))
    gameState.initAllocation.forEach((good, i) => (players[i].good = good))
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
    const gameState = await this.stateManager.getGameState(),
      playerState = await this.stateManager.getPlayerState(index),
      playerStates = await this.stateManager.getPlayerStates()
    switch (type) {
      case RoundMoveType.overPrePlay:
        const { goodStatus, initAllocation, allocation, overPrePlay } = gameState
        overPrePlay[index] = true
        if (params.join) {
          playerState.status = PlayerRoundStatus.play
        } else {
          const initGood = initAllocation[index]
          goodStatus[initGood] = GoodStatus.left
          allocation[index] = initGood
          playerState.status = PlayerRoundStatus.result
        }
        if (overPrePlay.every(o => o)) {
          for (let s of playerStates) {
            if (s.status === PlayerRoundStatus.prePlay) {
              s.status = PlayerRoundStatus.play
            }
          }
        }
        break
      case RoundMoveType.submit:
        playerState.status = PlayerRoundStatus.wait
        playerState.sort = params.sort
        if (playerStates.every(p => p.status === PlayerRoundStatus.wait || p.status === PlayerRoundStatus.result)) {
          await this.roundOver()
        }
        break
    }
  }
}

export class GroupLogic extends Round.Logic<
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
      playerStates = await this.stateManager.getPlayerStates()
    await Model.FreeStyleModel.create({
      game: this.gameId,
      key: `${this.groupIndex}_${round}`,
      data: playerStates.map(({ user, index, rounds }) => {
        const { initAllocation, allocation } = gameRoundState,
          { sort } = rounds[round],
          privatePrices = this.params.roundsParams[round].privatePriceMatrix[index]
        return {
          userName: user.name,
          stuNum: user.stuNum,
          playerIndex: index + 1,
          privatePrices: privatePrices.join(' , '),
          initGood: initAllocation[index] === null ? '' : initAllocation[index] + 1,
          initGoodPrice: privatePrices[initAllocation[index]] || '',
          join: sort.length === 0 ? 'No' : 'Yes',
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
