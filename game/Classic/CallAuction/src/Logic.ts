import { Group, Round } from '@extend/server'
import { IMoveCallback } from '@bespoke/share'
import { Model } from '@bespoke/server'
import { RoundDecorator } from '@extend/share'
import {
  IGroupCreateParams,
  IGroupGameState,
  IGroupMoveParams,
  IGroupPlayerState,
  IOrder,
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
  alive: boolean = true

  match(buyPrices: number[], sellPrices: number[]): Array<{ buy: number; sell: number }> {
    const result: Array<{ buy: number; sell: number }> = []
    let k = 0
    for (let i = 0; i < buyPrices.length; i++) {
      for (let j = k; j < sellPrices.length; j++) {
        if (buyPrices[i] === 0 || sellPrices[i] === 0) {
          continue
        }
        if (buyPrices[i] >= sellPrices[j]) {
          result.push({ buy: i, sell: j })
          k = j + 1
          break
        }
      }
    }
    return result
  }

  async roundStart() {
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
    const gameState = super.initGameState()
    gameState.timeLeft = this.params.t
    gameState.trades = []
    return gameState
  }

  async initPlayerState(index: number): Promise<RoundDecorator.TRoundPlayerState<IRoundPlayerState>> {
    const playerState = await super.initPlayerState(index)
    playerState.status = PlayerRoundStatus.play
    return playerState
  }

  async roundOver() {
    this.alive = false
    const gameState = await this.stateManager.getGameState(),
      playerStates = await this.stateManager.getPlayerStates()
    let buyOrders: IOrder[] = [],
      sellOrders: IOrder[] = []
    playerStates.map(({ price }, index) =>
      (index < this.params.buyerAmount ? buyOrders : sellOrders).push({
        player: index,
        price
      })
    )
    buyOrders = buyOrders.sort((b1, b2) => b1.price - b2.price)
    sellOrders = sellOrders.sort((s1, s2) => s2.price - s1.price)
    const trades = this.match(
      buyOrders.map(({ price }) => price),
      sellOrders.map(({ price }) => price)
    )
    gameState.trades = trades.map(({ buy, sell }) => ({
      buy: buyOrders[buy],
      sell: sellOrders[sell]
    }))
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
      case RoundMoveType.shout:
        playerState.status = PlayerRoundStatus.wait
        playerState.price = params.price
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
      { buyerAmount, buyPriceMatrix, sellPriceMatrix } = this.params.roundsParams[round],
      gameRoundState = gameState.rounds[round],
      playerStates = await this.stateManager.getPlayerStates()
    await Model.FreeStyleModel.create({
      game: this.gameId,
      key: `${this.groupIndex}_${round}`,
      data: playerStates.map(({ user, index, rounds }) => {
        const { trades } = gameRoundState,
          { price } = rounds[round],
          isBuyer = index < buyerAmount,
          [privatePrice] = [...buyPriceMatrix, ...sellPriceMatrix][index],
          trade = trades.find(({ buy, sell }) => (isBuyer ? buy : sell).player === index)
        return {
          userName: user.name,
          stuNum: user.stuNum,
          playerIndex: index + 1,
          role: isBuyer ? '买家' : '卖家',
          privatePrice,
          price: price || '',
          success: trade ? 'Yes' : 'No',
          pairIndex: trade ? (isBuyer ? trade.sell : trade.buy).player + 1 : ''
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
