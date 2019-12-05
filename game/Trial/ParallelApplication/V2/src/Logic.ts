import { BaseLogic, IActor, IMoveCallback, TGameState, TPlayerState } from '@bespoke/server'
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
    .sort((s1, s2) => s1.reduce((a, b) => a + b, 0) - s2.reduce((a, b) => a + b, 0))

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
      playerState = await this.stateManager.getPlayerState(actor),
      playerStates = await this.stateManager.getPlayerStates()
    switch (type) {
      case MoveType.init:
        if (playerState.index === undefined && gameState.playerNum < CONFIG.groupSize) {
          playerState.scene = SceneName.start
          playerState.index = gameState.playerNum++
          playerState.score = this.scores[playerState.index]
          if (playerState.index === 0) {
            global.setTimeout(async () => {
              for (let i = gameState.playerNum; i < CONFIG.groupSize; i++) {
                // await this.startRobot(i)
              }
            }, 10e3)
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
          global.setTimeout(async () => await this.match(0), 2e3)
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
      applications: playerState.applications,
      applicationIndex
    })
    global.setTimeout(async () => {
      const universityIndex = playerState.applications[applicationIndex]
      if (gameState.quota[universityIndex] > 0) {
        gameState.quota[universityIndex]--
        playerState.offer = universityIndex
        this.broadcast(PushType.apply, { universityIndex })
        await this.match(playerIndex + 1)
      } else if (applicationIndex < 2) {
        await this.match(playerIndex, applicationIndex + 1)
      } else {
        Log.i('落榜')
        await this.match(playerIndex + 1)
      }
    }, 2e3)
  }

  async end() {
    const playerStates = await this.stateManager.getPlayerStates()
    Object.values(playerStates).forEach(s => (s.scene = SceneName.result))
    await this.stateManager.syncState()
  }
}
