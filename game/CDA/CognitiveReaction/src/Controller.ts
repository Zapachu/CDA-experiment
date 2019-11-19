import {
  BaseController,
  IActor,
  IMoveCallback,
  TGameState,
  baseEnum,
  TPlayerState,
  Model,
  GameStatus
} from '@bespoke/server'
import { ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams } from './interface'
import { MoveType, GameStage, PushType, SheetType, IResult, QUESTIONS, PlayerStage } from './config'

export const QUESTION_ANSWERS: Array<string> = ['0.05', '5', '47', '4', '29', '20', 'C']

export class Controller extends BaseController<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  private timer: NodeJS.Timer

  initGameState(): TGameState<IGameState> {
    const gameState = super.initGameState()
    gameState.gameStage = GameStage.seatNumber
    gameState.time = 0
    return gameState
  }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const playerState = await super.initPlayerState(actor)
    playerState.answers = []
    return playerState
  }

  protected async playerMoveReducer(
    actor: IActor,
    type: string,
    params: IMoveParams,
    cb?: IMoveCallback
  ): Promise<void> {
    const playerStates = await this.stateManager.getPlayerStates(),
      playerState = await this.stateManager.getPlayerState(actor)
    switch (type) {
      case MoveType.submitSeatNumber: {
        const hasBeenOccupied = Object.values(playerStates).some(({ seatNumber }) => seatNumber === params.seatNumber)
        if (hasBeenOccupied) {
          cb(false)
          break
        }
        playerState.seatNumber = params.seatNumber
        playerState.index = 0
        break
      }
      case MoveType.answer: {
        playerState.answers[playerState.index] = params.answer
        if (playerState.index >= QUESTIONS.length - 1) {
          this.calcResult(playerState)
        } else {
          playerState.index += 1
        }
        break
      }
    }
  }

  async onGameOver(): Promise<void> {
    await this.handleGameOver()
  }

  async handleGameOver(): Promise<void> {
    global.clearInterval(this.timer)
    const playerStates = await this.stateManager.getPlayerStates()
    const tasks = Object.values(playerStates).map(async playerState => {
      if (playerState.playerStage !== PlayerStage.over) {
        await this.calcResult(playerState)
      }
    })
    await Promise.all(tasks)
  }

  protected async teacherMoveReducer(
    actor: IActor,
    type: string,
    params: IMoveParams,
    cb?: IMoveCallback
  ): Promise<void> {
    const {
      game: {
        params: { timeLimit }
      }
    } = this
    const gameState = await this.stateManager.getGameState()
    switch (type) {
      case MoveType.startMainTest: {
        gameState.gameStage = GameStage.mainTest
        this.timer = global.setInterval(async () => {
          if (gameState.status !== GameStatus.started) {
            return
          }
          if (gameState.time++ >= timeLimit * 60) {
            await this.handleGameOver()
          }
          await this.stateManager.syncState()
        }, 1000)
      }
    }
  }

  calcResult = async (playerState: IPlayerState) => {
    let correctNumber = 0
    playerState.answers.forEach((ans, i) => {
      if (ans === QUESTION_ANSWERS[i]) correctNumber++
    })
    const point = Number((correctNumber * this.game.params.exchangeRate).toFixed(2))
    playerState.correctNumber = correctNumber
    playerState.point = point
    playerState.playerStage = PlayerStage.over
    const data: IResult = {
      seatNumber: playerState.seatNumber,
      answers: playerState.answers
    }
    await new Model.FreeStyleModel({
      game: this.game.id,
      key: SheetType.result,
      data
    }).save()
  }
}
