import { Group } from '@extend/server'
import { IMoveCallback, IUserWithId } from '@bespoke/share'
import { GroupDecorator } from '@extend/share'
import {
  CONFIG,
  GoodStatus,
  ICreateParams,
  IGameRoundState,
  IGameState,
  IMoveParams,
  IPlayerRoundState,
  IPlayerState,
  IPushParams,
  MoveType,
  PlayerRoundStatus,
  PlayerStatus,
  PushType
} from './config'
import { Model } from '@bespoke/server'
import { Log } from '@elf/util'
import { IPlayer, match } from './util/Match'
import shuffle = require('lodash/shuffle')

export class GroupLogic extends Group.Group.Logic<
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
    gameState.rounds = []
    return gameState
  }

  async initPlayerState(
    user: IUserWithId,
    groupIndex: number,
    index: number
  ): Promise<GroupDecorator.TPlayerState<IPlayerState>> {
    const playerState = await super.initPlayerState(user, groupIndex, index)
    playerState.status = PlayerStatus.guide
    playerState.rounds = []
    return playerState
  }

  async startRound(r: number) {
    const { round, oldPlayer, minPrivateValue, maxPrivateValue } = this.params
    if (r >= round) {
      return
    }
    const gameState = await this.stateManager.getGameState(),
      playerStates = await this.stateManager.getPlayerStates()
    gameState.round = r
    const goodStatus = [
        ...Array(oldPlayer).fill(GoodStatus.old),
        ...Array(this.groupSize - oldPlayer).fill(GoodStatus.new)
      ],
      initAllocation = shuffle(goodStatus.map((s, i) => (s === GoodStatus.new ? null : i)))

    gameState.rounds[r] = {
      timeLeft: CONFIG.tradeSeconds,
      goodStatus,
      initAllocation,
      overPrePlay: initAllocation.map(a => a === null),
      allocation: []
    }
    Object.values(playerStates).forEach(
      p =>
        (p.rounds[r] = {
          status: PlayerRoundStatus.prePlay,
          sort: [],
          privatePrices: Array(this.groupSize)
            .fill(null)
            .map(() => ~~(minPrivateValue + Math.random() * (maxPrivateValue - minPrivateValue)))
        })
    )
    await this.stateManager.syncState()
  }

  async getState(): Promise<{
    gameState: IGameState
    gameRoundState: IGameRoundState
    playerStatesArr: GroupDecorator.TPlayerState<IPlayerState>[]
    playerRoundStates: IPlayerRoundState[]
  }> {
    const gameState = await this.stateManager.getGameState(),
      { round } = gameState,
      gameRoundState = gameState.rounds[round],
      playerStates = await this.stateManager.getPlayerStates(),
      playerStatesArr = Object.values<GroupDecorator.TPlayerState<IPlayerState>>(playerStates).sort(
        (p1, p2) => p1.index - p2.index
      ),
      playerRoundStates = playerStatesArr.map(({ rounds }) => rounds[round])
    return {
      gameState,
      gameRoundState,
      playerStatesArr,
      playerRoundStates
    }
  }

  match(players: IPlayer[]): number[] {
    Log.d(players)
    return match(players)
  }

  async roundOver() {
    const { gameState, gameRoundState, playerRoundStates, playerStatesArr } = await this.getState()
    const players: IPlayer[] = playerRoundStates.map(({ sort }) => ({ sort }))
    gameRoundState.initAllocation.forEach((good, i) => (players[i].good = good))
    gameRoundState.allocation = match(players)
    playerRoundStates.forEach(p => (p.status = PlayerRoundStatus.result))
    await this.stateManager.syncState()
    global.setTimeout(async () => {
      gameState.round < this.params.round - 1
        ? this.startRound(gameState.round + 1)
        : playerStatesArr.forEach(p => (p.status = PlayerStatus.result))
      await this.stateManager.syncState()
    }, 5e3)
    await Model.FreeStyleModel.create({
      game: this.gameId,
      key: `${this.groupIndex}_${gameState.round}`,
      data: playerStatesArr.map(({ user, index, rounds }) => {
        const { initAllocation, allocation } = gameRoundState
        const { privatePrices, sort } = rounds[gameState.round]
        return {
          user: user.stuNum,
          playerIndex: index + 1,
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

  async playerMoveReducer(index: number, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    const { groupSize } = this
    const { gameState, playerStatesArr, playerRoundStates } = await this.getState(),
      playerState = await this.stateManager.getPlayerState(index),
      { round } = gameState,
      gameRoundState = gameState.rounds[round],
      playerRoundState = playerState.rounds[round]
    switch (type) {
      case MoveType.guideDone: {
        if (playerState.status === PlayerStatus.round) {
          break
        }
        playerState.status = PlayerStatus.round
        if (playerStatesArr.length === groupSize && playerStatesArr.every(p => p.status === PlayerStatus.round)) {
          this.startRound(0)
        }
        break
      }
      case MoveType.overPrePlay: {
        const { goodStatus, initAllocation, allocation, overPrePlay } = gameRoundState
        overPrePlay[playerState.index] = true
        if (params.join) {
          playerRoundState.status = PlayerRoundStatus.play
        } else {
          const initGood = initAllocation[playerState.index]
          goodStatus[initGood] = GoodStatus.left
          allocation[playerState.index] = initGood
          playerRoundState.status = PlayerRoundStatus.result
        }
        if (overPrePlay.every(o => o)) {
          for (let s of playerRoundStates) {
            if (s.status === PlayerRoundStatus.prePlay) {
              s.status = PlayerRoundStatus.play
            }
          }
        }
        break
      }
      case MoveType.submit: {
        playerRoundState.sort = params.sort
        playerRoundState.status = PlayerRoundStatus.wait
        if (
          playerRoundStates.every(p => p.status === PlayerRoundStatus.wait || p.status === PlayerRoundStatus.result)
        ) {
          this.roundOver()
        }
        break
      }
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
