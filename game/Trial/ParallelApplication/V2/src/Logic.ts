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

export class Logic extends BaseLogic<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  scores = Array(CONFIG.groupSize)
    .fill(null)
    .map(() => [
      ~~(Math.random() * 30) + 120,
      ~~(Math.random() * 15) + 135,
      ~~(Math.random() * 20) + 130,
      ~~(Math.random() * 50) + 250
    ])
    .sort((s1, s2) => s2.reduce((a, b) => a + b, 0) - s1.reduce((a, b) => a + b, 0))

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
        if (playerState.index === undefined && gameState.playerNum < CONFIG.groupSize) {
          playerState.scene = SceneName.start
          playerState.index = gameState.playerNum++
          playerState.score = this.scores[playerState.index]
          if (playerState.index === 0) {
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
        playerSubmit[playerState.index] = true
        playerState.scene = SceneName.match
        if (playerSubmit.every(s => s)) {
          global.setTimeout(async () => await this.match(0), 0)
        }
        break
      }
    }
  }

  async match(playerIndex: number, applicationIndex: number = 0) {
    const gameState = await this.stateManager.getGameState(),
      playerStates = await this.stateManager.getPlayerStates(),
      playerState = Object.values(playerStates).find(s => s.index === playerIndex)
    if (!playerState) {
      this.end()
      return
    }
    this.broadcast(PushType.match, {
      index: playerIndex,
      score: playerState.score,
      applications: playerState.applications,
      applicationIndex
    })
    await Util.sleep(2)
    const universityIndex = playerState.applications[applicationIndex]
    if (gameState.quota[universityIndex] > 0) {
      gameState.quota[universityIndex]--
      playerState.offer = universityIndex
      this.broadcast(PushType.apply, { index: playerIndex, universityIndex })
      await Util.sleep(2)
      await this.match(playerIndex + 1)
    } else if (applicationIndex < 2) {
      await this.match(playerIndex, applicationIndex + 1)
    } else {
      Log.i('落榜')
      await this.match(playerIndex + 1)
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

  static getRandomApplications(): number[] {
    const indices = CONFIG.universities.map((_, i) => i)
    for (let i = 0; i < 3; i++) {
      const j = ~~(Math.random() * indices.length),
        temp = indices[j]
      indices[j] = indices[i]
      indices[i] = temp
    }
    return indices.slice(0, 3)
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
    if (this.playerState.index === undefined) {
      return
    }
    this.frameEmitter.emit(MoveType.toChose)
    await Util.sleep()
    this.frameEmitter.emit(MoveType.toConfirm, { applications: Util.getRandomApplications() })
    await Util.sleep()
    this.frameEmitter.emit(MoveType.toMatch)
  }
}
