import { BaseLogic, IActor, IMoveCallback, TGameState, TPlayerState } from '@bespoke/server'
import { BaseRobot } from '@bespoke/robot'
import { Log } from '@elf/util'
import {
  CONFIG,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  PushType,
  SceneName
} from './config'
import shuffle = require('lodash/shuffle')

export class Logic extends BaseLogic<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  positions: Array<{
    score: number[]
    totalScore: number
    rank: number
  }> = shuffle(
    Array(CONFIG.groupSize)
      .fill(null)
      .map(() => {
        const score = [
            ~~(Math.random() * 30) + 120,
            ~~(Math.random() * 15) + 135,
            ~~(Math.random() * 20) + 130,
            ~~(Math.random() * 50) + 250
          ],
          totalScore = score.reduce((a, b) => a + b, 0)
        return {
          score,
          totalScore,
          rank: -1
        }
      })
      .sort((s1, s2) => s2.totalScore - s1.totalScore)
      .map((s, rank) => ({ ...s, rank }))
  )

  initGameState(): TGameState<IGameState> {
    const gameState = super.initGameState()
    gameState.playerNum = 0
    gameState.playerSubmit = Array(CONFIG.groupSize).fill(false)
    gameState.quota = CONFIG.universities.map(({ quota }) => quota)
    return gameState
  }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const playerState = await super.initPlayerState(actor)
    playerState.scene = SceneName.boot
    playerState.candidateNumber = Math.random()
      .toString()
      .slice(2, 8)
    return playerState
  }

  async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    const gameState = await this.stateManager.getGameState(),
      playerState = await this.stateManager.getPlayerState(actor)
    switch (type) {
      case MoveType.init:
        if (playerState.rank === undefined && gameState.playerNum < CONFIG.groupSize) {
          playerState.scene = SceneName.start
          const position = this.positions[gameState.playerNum++]
          playerState.rank = position.rank
          playerState.score = position.score
          if (gameState.playerNum === 1) {
            global.setTimeout(async () => {
              for (let i = gameState.playerNum; i < CONFIG.groupSize; i++) {
                await this.startRobot(i)
              }
            }, 5e3)
          }
        }
        break
      case MoveType.toChose:
        playerState.scene = SceneName.chose
        break
      case MoveType.toConfirm:
        playerState.applications = params.applications
        playerState.scene = SceneName.confirm
        break
      case MoveType.reChose:
        playerState.applications = []
        playerState.scene = SceneName.chose
        break
      case MoveType.toMatch: {
        const { playerSubmit } = gameState
        playerSubmit[playerState.rank] = true
        playerState.scene = SceneName.match
        if (playerSubmit.every(s => s)) {
          global.setTimeout(async () => await this.match(0), 1e3)
        }
        break
      }
    }
  }

  async match(rank: number, applicationIndex: number = 0) {
    const gameState = await this.stateManager.getGameState(),
      playerStates = await this.stateManager.getPlayerStates(),
      playerState = Object.values(playerStates).find(s => s.rank === rank)
    if (!playerState) {
      this.end()
      return
    }
    this.broadcast(PushType.match, {
      rank,
      score: playerState.score,
      applications: playerState.applications,
      applicationIndex
    })
    await Util.sleep(2)
    const universityIndex = playerState.applications[applicationIndex]
    if (gameState.quota[universityIndex] > 0) {
      gameState.quota[universityIndex]--
      playerState.offer = universityIndex
      this.broadcast(PushType.apply, { rank, universityIndex })
      await Util.sleep(2)
      await this.match(rank + 1)
    } else if (applicationIndex < 2) {
      await this.match(rank, applicationIndex + 1)
    } else {
      Log.i('落榜')
      await this.match(rank + 1)
    }
  }

  async end() {
    const playerStates = await this.stateManager.getPlayerStates()
    Object.values(playerStates).forEach(s => (s.scene = SceneName.result))
    await this.stateManager.syncState()
  }
}

export class Util {
  static async sleep(second: number = 1) {
    return new Promise(resolve => {
      global.setTimeout(() => resolve(), second * (900 + Math.random() * 200))
    })
  }
}

export class Robot extends BaseRobot<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  async init(): Promise<this> {
    super.init()
    this.start().catch(e => Log.e(e))
    return this
  }

  async start() {
    await Util.sleep(Math.random() * 5)
    this.frameEmitter.emit(MoveType.init)
    await Util.sleep()
    if (this.playerState.rank === undefined) {
      return
    }
    this.frameEmitter.emit(MoveType.toChose)
    await Util.sleep()
    this.frameEmitter.emit(MoveType.toConfirm, {
      applications: shuffle(CONFIG.universities.map((_, i) => i)).slice(0, 3)
    })
    await Util.sleep()
    this.frameEmitter.emit(MoveType.toMatch)
  }
}
