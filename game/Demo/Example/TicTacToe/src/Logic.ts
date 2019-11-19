import { BaseLogic, IActor, IMoveCallback, TGameState } from '@bespoke/server'
import {
  Const,
  GameStatus,
  ICreateParams,
  IGameGroupState,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  Piece,
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
    gameState.groups = []
    return gameState
  }

  async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    const gameState = await this.stateManager.getGameState(),
      playerState = await this.stateManager.getPlayerState(actor)
    switch (type) {
      case MoveType.getGroup: {
        if (playerState.groupIndex !== undefined) {
          break
        }
        let groupIndex = gameState.groups.findIndex(({ playerNum }) => playerNum < Const.roomSize)
        if (groupIndex === -1) {
          const newGroup: IGameGroupState = {
            playerNum: 0,
            pieces: Array(Math.pow(Const.matrixSize, 2)).fill(Piece.null),
            status: GameStatus.matching,
            pieceTurn: Piece.o
          }
          groupIndex = gameState.groups.push(newGroup) - 1
        }
        playerState.groupIndex = groupIndex
        const gameGroupState = gameState.groups[groupIndex]
        if (gameGroupState.playerNum++ === 0) {
          playerState.piece = Piece.o
        } else {
          playerState.piece = Piece.x
          gameGroupState.status = GameStatus.play
        }
        break
      }
      case MoveType.move: {
        const gameGroupState = gameState.groups[playerState.groupIndex],
          { pieces } = gameGroupState
        if (pieces[params.index] === Piece.null && gameGroupState.pieceTurn === playerState.piece) {
          pieces[params.index] = playerState.piece
          gameGroupState.pieceTurn = playerState.piece === Piece.o ? Piece.x : Piece.o
        }
        const row = ~~(params.index / Const.matrixSize),
          col = params.index % Const.matrixSize
        const matrixSizeIterator = Array(Const.matrixSize).fill(null)
        const lines: Array<Array<Piece>> = [
          pieces.slice(row * Const.matrixSize, (row + 1) * Const.matrixSize),
          matrixSizeIterator.map((_, i) => pieces[i * Const.matrixSize + col])
        ]
        if (row === col) {
          lines.push(matrixSizeIterator.map((_, i) => pieces[i * Const.matrixSize + i]))
        }
        if (row + col === Const.matrixSize - 1) {
          lines.push(matrixSizeIterator.map((_, i) => pieces[i * Const.matrixSize + Const.matrixSize - i - 1]))
        }
        if (
          pieces.every(piece => piece != Piece.null) ||
          lines.some(line => line.every(piece => piece === playerState.piece))
        ) {
          gameGroupState.status = GameStatus.result
        }
      }
    }
  }
}
