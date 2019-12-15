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
  Mode,
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

  async initPlayerState(index: number): Promise<IRoundPlayerState> {
    const playerState = await super.initPlayerState(index)
    playerState.status = PlayerRoundStatus.play
    return playerState
  }

  initGameState(): IRoundGameState {
    const gameState = super.initGameState()
    gameState.timeLeft = this.params.t
    gameState.players = Array(this.groupSize)
      .fill(null)
      .map(() => ({
        x: 0,
        d: 0,
        extra: 0
      }))
    return gameState
  }

  async roundOver() {
    this.alive = false
    const roundGameState = await this.stateManager.getGameState(),
      roundPlayerStates = await this.stateManager.getPlayerStates()
    roundGameState.reward = ~~(
      (roundGameState.players.map(({ x }) => this.params.M - x).reduce((m, n) => m + n, 0) * this.params.K) /
      this.groupSize
    )
    switch (this.params.mode) {
      case Mode.normal:
        break
      case Mode.reward: {
        let rewardPlayerIndex = 0,
          dSum = 0
        roundGameState.players.forEach(({ x, d }, i) => {
          dSum += d
          if (x > roundGameState.players[rewardPlayerIndex].x) {
            rewardPlayerIndex = i
          }
        })
        roundGameState.players[rewardPlayerIndex].extra = ~~(dSum * this.params.P)
        break
      }
      case Mode.punish: {
        let rewardPlayerIndex = 0,
          dSum = 0
        roundGameState.players.forEach(({ x, d }, i) => {
          dSum += d
          if (x < roundGameState.players[rewardPlayerIndex].x) {
            rewardPlayerIndex = i
          }
        })
        roundGameState.players[rewardPlayerIndex].extra = ~~(-dSum * this.params.P)
        break
      }
    }
    roundPlayerStates.forEach(p => (p.status = PlayerRoundStatus.result))
    await this.stateManager.syncState()
    global.setTimeout(async () => await this.overCallback(), 5e3)
  }

  async playerMoveReducer(
    index: number,
    type: RoundMoveType,
    params: IRoundMoveParams,
    cb: IMoveCallback
  ): Promise<void> {
    const roundPlayerState = await this.stateManager.getPlayerState(index),
      roundGameState = await this.stateManager.getGameState()
    switch (type) {
      case RoundMoveType.submit: {
        Object.assign(roundGameState.players[index], params)
        roundPlayerState.status = PlayerRoundStatus.wait
        if (roundGameState.players.every(({ x }) => x)) {
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
      { round, rounds } = gameState,
      { players, reward } = rounds[round],
      playerStates = await this.stateManager.getPlayerStates()
    await Model.FreeStyleModel.create({
      game: this.gameId,
      key: `${this.groupIndex}_${gameState.round}`,
      data: playerStates.map(({ user, index }) => {
        const { x, d, extra } = players[index]
        return {
          userName: user.name,
          stuNum: user.stuNum,
          playerIndex: index + 1,
          x,
          d,
          extra,
          reward
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
