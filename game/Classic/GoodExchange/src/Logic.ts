import { Group, Round } from '@extend/server'
import { IMoveCallback } from '@bespoke/share'
import { Model } from '@bespoke/server'
import {
  ExchangeStatus,
  GroupMoveType,
  IGroupCreateParams,
  IGroupGameState,
  IGroupMoveParams,
  IGroupPlayerState,
  IPushParams,
  IRoundCreateParams,
  IRoundGameState,
  IRoundMoveParams,
  IRoundPlayerState,
  PushType,
  RoundMoveType
} from './config'
import { RoundDecorator } from '@extend/share'

class RoundLogic extends Round.Round.Logic<
  IRoundCreateParams,
  IRoundGameState,
  IRoundPlayerState,
  RoundMoveType,
  PushType,
  IRoundMoveParams,
  IPushParams
> {
  alive: boolean = true

  async roundStart() {
    return
    const gameState = await this.stateManager.getGameState()
    const timer = global.setInterval(async () => {
      if (!this.alive) {
        global.clearInterval(timer)
      }
      if (gameState.timeLeft <= 1) {
        await this.roundOver()
        global.clearInterval(timer)
      }
      gameState.timeLeft--
      await this.stateManager.syncState()
    }, 1e3)
  }

  initGameState(): RoundDecorator.TRoundGameState<IRoundGameState> {
    const { privatePriceMatrix } = this.params
    const gameState = super.initGameState()
    gameState.timeLeft = this.params.t
    gameState.allocation = privatePriceMatrix.map(() => null)
    gameState.exchangeMatrix = privatePriceMatrix.map(row => row.map(() => ExchangeStatus.null))
    return gameState
  }

  async roundOver() {
    this.alive = false
    const { allocation } = await this.stateManager.getGameState()
    allocation.forEach((good, i) => (good === null ? (allocation[i] = i) : null))
    await this.overCallback()
  }

  async playerMoveReducer(
    index: number,
    type: RoundMoveType,
    params: IRoundMoveParams,
    cb: IMoveCallback
  ): Promise<void> {
    const gameRoundState = await this.stateManager.getGameState()
    switch (type) {
      case RoundMoveType.exchange: {
        const { exchangeMatrix, allocation } = gameRoundState,
          { good } = params
        if (exchangeMatrix[good][index] === ExchangeStatus.waiting) {
          exchangeMatrix[good].fill(ExchangeStatus.null)
          exchangeMatrix[good][index] = ExchangeStatus.exchanged
          exchangeMatrix[index].fill(ExchangeStatus.null)
          exchangeMatrix[index][good] = ExchangeStatus.exchanged
          allocation[good] = index
          allocation[index] = good
        } else {
          exchangeMatrix[index][good] = ExchangeStatus.waiting
        }
        if (allocation.every(p => p !== null)) {
          this.roundOver()
        }
        break
      }
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
      { privatePriceMatrix } = this.params.roundsParams[round],
      gameRoundState = gameState.rounds[round],
      playerStates = await this.stateManager.getPlayerStates()
    await Model.FreeStyleModel.create({
      game: this.gameId,
      key: `${this.groupIndex}_${gameState.round}`,
      data: playerStates.map(({ user, index: indexInGroup, rounds }) => {
        const { index: indexInRound } = rounds[round]
        const { allocation } = gameRoundState
        const privatePrices = privatePriceMatrix[indexInGroup]
        return {
          userName: user.name,
          stuNum: user.stuNum,
          indexInGroup: indexInGroup + 1,
          privatePrices: privatePrices.join(' , '),
          initGood: String.fromCharCode(65 + indexInRound),
          initGoodPrice: privatePrices[indexInRound],
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
  GroupMoveType,
  PushType,
  IGroupMoveParams,
  IPushParams
> {
  GroupLogic = GroupLogic
}
