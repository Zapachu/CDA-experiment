import { Group, Round } from '@extend/server'
import { IMoveCallback } from '@bespoke/share'
import { Model } from '@bespoke/server'
import {
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
  PlayerRoundStatus,
  PushType,
  Role,
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

  initGameState(): IRoundGameState {
    const { buyPriceMatrix, sellPriceMatrix } = this.params
    const gameState = super.initGameState()
    gameState.timeLeft = this.params.t
    gameState.trades = []
    gameState.shouts = [...buyPriceMatrix, ...sellPriceMatrix].map(() => null)
    return gameState
  }

  async initPlayerState(index: number): Promise<IRoundPlayerState> {
    const playerState = await super.initPlayerState(index)
    playerState.status = PlayerRoundStatus.play
    return playerState
  }

  async roundOver() {
    this.alive = false
    const playerStates = await this.stateManager.getPlayerStates()
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
      playerStates = await this.stateManager.getPlayerStates(),
      gameState = await this.stateManager.getGameState(),
      { buyPriceMatrix, sellPriceMatrix, buyerAmount } = this.params
    switch (type) {
      case RoundMoveType.shout:
        playerState.status = PlayerRoundStatus.wait
        playerState.price = params.price
        const myIndex = index
        const { shouts, trades } = gameState
        let myShout = shouts[myIndex]
        if (myShout) {
          break
        } else {
          playerState.status = PlayerRoundStatus.wait
        }
        myShout = {
          price: params.price,
          role: index < buyerAmount ? Role.buyer : Role.seller,
          tradePair: null
        }
        shouts[myIndex] = myShout
        const pairShoutIndex = shouts.findIndex(shout => {
          if (!shout || shout.role === myShout.role || shout.tradePair !== null) {
            return false
          }
          return myShout.role === Role.seller ? shout.price >= myShout.price : shout.price <= myShout.price
        })
        if (pairShoutIndex === -1) {
          break
        }
        myShout.tradePair = pairShoutIndex
        shouts[pairShoutIndex].tradePair = myIndex
        const newTrade = {
          reqIndex: pairShoutIndex,
          resIndex: index,
          price: shouts[pairShoutIndex].price
        }
        trades.push(newTrade)
        const pairRoundState = playerStates[pairShoutIndex]
        playerState.profit = Math.abs([...buyPriceMatrix, ...sellPriceMatrix][index][0] - newTrade.price)
        pairRoundState.profit = Math.abs([...buyPriceMatrix, ...sellPriceMatrix][pairShoutIndex][0] - newTrade.price)
        if (gameState.shouts.every(s => s)) {
          this.roundOver()
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
      groupPlayerStates = await this.stateManager.getPlayerStates()
    await Model.FreeStyleModel.create({
      game: this.gameId,
      key: `${this.groupIndex}_${round}`,
      data: groupPlayerStates
        .map(({ user, index, rounds }) => {
          const { shouts, trades } = gameRoundState,
            { price, profit } = rounds[round],
            shout = shouts[index],
            isBuyer = index < buyerAmount,
            [privatePrice] = [...buyPriceMatrix, ...sellPriceMatrix][index],
            trade = trades.find(({ reqIndex, resIndex }) => [reqIndex, resIndex].includes(index))
          return {
            userName: user.name,
            stuNum: user.stuNum,
            playerIndex: index + 1,
            role: isBuyer ? '买家' : '卖家',
            privatePrice,
            price: price || '',
            success: trade ? 'Yes' : 'No',
            pairIndex: trade ? (trade.reqIndex === index ? trade.resIndex : trade.reqIndex) + 1 : '',
            profit: profit || ''
          }
        })
        .sort(({ playerIndex: p1 }, { playerIndex: p2 }) => p1 - p2)
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
