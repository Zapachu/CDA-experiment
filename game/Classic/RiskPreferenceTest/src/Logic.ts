import { Group, Round } from '@extend/server'
import { IMoveCallback } from '@bespoke/share'
import { Model } from '@bespoke/server'
import { RoundDecorator } from '@extend/share'
import {
  awardLimit,
  Choice,
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
  RoundMoveType,
  TRange
} from './config'

function randomNumber([min, max]: [number, number]) {
  return ~~(min + Math.random() * (max - min))
}

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
    playerState.T = randomNumber(TRange)
    playerState.preference = null
    return playerState
  }

  initGameState(): RoundDecorator.TRoundGameState<IRoundGameState> {
    const gameState = super.initGameState()
    gameState.timeLeft = this.params.t
    return gameState
  }

  async roundOver() {
    this.alive = false
    const roundPlayerStates = await this.stateManager.getPlayerStates()
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
      roundPlayerStates = await this.stateManager.getPlayerStates()
    switch (type) {
      case RoundMoveType.submit: {
        const { preference } = params
        roundPlayerState.status = PlayerRoundStatus.wait
        roundPlayerState.preference = preference
        const { awardA, awardB } = this.params
        const caseIndex = ~~(Math.random() * preference.length),
          p = +(caseIndex / preference.length).toFixed(1),
          award = preference[caseIndex] === Choice.A ? awardA : awardB,
          success = Math.random() <= p
        roundPlayerState.result = {
          caseIndex,
          success,
          award: success ? award : awardLimit - award
        }
        if (roundPlayerStates.every(p => p.preference)) {
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
      playerStates = await this.stateManager.getPlayerStates()
    await Model.FreeStyleModel.create({
      game: this.gameId,
      key: `${this.groupIndex}_${gameState.round}`,
      data: playerStates.map(({ user, index, rounds }) => {
        const {
          T,
          preference,
          result = {
            caseIndex: undefined,
            success: false,
            award: 0
          }
        } = rounds[round]
        const { caseIndex, success, award } = result
        return {
          userName: user.name,
          stuNum: user.stuNum,
          playerIndex: index + 1,
          T,
          preference: (preference ? preference.map(c => (c === Choice.A ? 'A' : 'B')) : []).join('>'),
          caseIndex: caseIndex === undefined ? '' : +caseIndex + 1,
          success: success.toString(),
          award
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
