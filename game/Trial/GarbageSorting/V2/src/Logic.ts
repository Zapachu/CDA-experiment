import { BaseLogic, IActor, IMoveCallback, TGameState, TPlayerState } from '@bespoke/server'
import { BaseRobot } from '@bespoke/robot'
import {
  CONFIG,
  GarbageConfig,
  GarbageType,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  PlayerStatus,
  PushType
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
  initGameState(): TGameState<IGameState> {
    const gameState = super.initGameState()
    gameState.env = CONFIG.maxEnv
    gameState.playerNum = 0
    gameState.sorts = Array(CONFIG.groupSize)
      .fill(null)
      .map(() => [])
    return gameState
  }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const playerState = await super.initPlayerState(actor)
    playerState.status = PlayerStatus.play
    playerState.garbageIndex = 0
    playerState.life = CONFIG.maxLife
    playerState.score = 0
    return playerState
  }

  async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    const gameState = await this.stateManager.getGameState(),
      playerState = await this.stateManager.getPlayerState(actor)
    switch (type) {
      case MoveType.prepare: {
        if (playerState.index === undefined && gameState.playerNum < CONFIG.groupSize) {
          playerState.index = gameState.playerNum++
          if (playerState.index === 0) {
            global.setTimeout(async () => {
              for (let i = gameState.playerNum; i < CONFIG.groupSize; i++) {
                await this.startRobot(i)
              }
            }, 10e3)
          }
        }
        cb({ env: gameState.env, ...playerState })
        break
      }
      case MoveType.submit: {
        const { i, t } = params
        if (gameState.sorts[playerState.index][i] !== undefined) {
          break
        }
        gameState.sorts[playerState.index][i] = t
        if (t === GarbageType.skip) {
          gameState.env -= CONFIG.pollutionOfSkip
        } else {
          playerState.life -= CONFIG.sortCost
          if (t !== GarbageConfig[params.i].type) {
            playerState.score += CONFIG.wrongScore
            gameState.env -= CONFIG.pollutionOfWrong
          } else {
            playerState.score += CONFIG.rightScore
          }
        }
        if (gameState.env < 0) {
          gameState.env = 0
        }
        if (playerState.garbageIndex < GarbageConfig.length - 1) {
          playerState.garbageIndex++
        } else {
          playerState.status = PlayerStatus.result
        }
        this.broadcast(PushType.sync, {
          env: gameState.env,
          ...params,
          ...playerState
        })
      }
    }
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
    global.setTimeout(
      () =>
        this.frameEmitter.emit(MoveType.prepare, {}, () => {
          const interval = global.setInterval(() => {
            const { garbageIndex, index, status } = this.playerState
            if (index === undefined || status === PlayerStatus.result) {
              global.clearInterval(interval)
              return
            }
            const types: GarbageType[] = Object.keys(GarbageType)
              .map(k => +k)
              .filter(k => !isNaN(k)) as any
            this.frameEmitter.emit(MoveType.submit, {
              i: garbageIndex,
              t: types[~~(Math.random() * types.length)]
            })
          }, (300 + Math.random() * 200) * CONFIG.sortSeconds)
        }),
      Math.random() * CONFIG.sortSeconds * 1000
    )
    return this
  }
}
