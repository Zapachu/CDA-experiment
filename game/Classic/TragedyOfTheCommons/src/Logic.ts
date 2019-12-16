import { Group, Round } from '@extend/server'
import { IMoveCallback } from '@bespoke/share'
import { Model } from '@bespoke/server'
import { RoundDecorator } from '@extend/share'
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

  async initPlayerState(index: number): Promise<RoundDecorator.TRoundPlayerState<IRoundPlayerState>> {
    const playerState = await super.initPlayerState(index)
    playerState.status = PlayerRoundStatus.play
    return playerState
  }

  initGameState(): RoundDecorator.TRoundGameState<IRoundGameState> {
    const gameState = super.initGameState()
    gameState.timeLeft = this.params.t
    gameState.xArr = Array(this.groupSize).fill(0)
    return gameState
  }

  async roundOver() {
    this.alive = false
    const roundGameState = await this.stateManager.getGameState(),
      roundPlayerStates = await this.stateManager.getPlayerStates()
    roundGameState.reward = ~~(
      (roundGameState.xArr.map(x => this.params.M - x).reduce((m, n) => m + n, 0) * this.params.K) /
      this.groupSize
    )
    roundPlayerStates.forEach(p => (p.status = PlayerRoundStatus.result))
    await this.overCallback()
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
        const { x } = params
        roundGameState.xArr[index] = x
        roundPlayerState.status = PlayerRoundStatus.wait
        if (roundGameState.xArr.every(x => x)) {
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
      { xArr, reward } = rounds[round],
      playerStates = await this.stateManager.getPlayerStates()
    await Model.FreeStyleModel.create({
      game: this.gameId,
      key: `${this.groupIndex}_${gameState.round}`,
      data: playerStates.map(({ user, index }) => {
        return {
          userName: user.name,
          stuNum: user.stuNum,
          playerIndex: index + 1,
          x: xArr[index],
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
