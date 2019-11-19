export const namespace = 'TicTacToe'

export interface ICreateParams {}

export enum Piece {
  null,
  x,
  o
}

export enum GameStatus {
  matching,
  play,
  result
}

export interface IGameGroupState {
  playerNum: number
  status: GameStatus
  pieces: Array<Piece>
  pieceTurn: Piece
}

export interface IGameState {
  groups: Array<IGameGroupState>
}

export interface IPlayerState {
  groupIndex: number
  piece: Piece
}

export enum MoveType {
  getGroup,
  move
}

export enum PushType {}

export interface IMoveParams {
  index: number // piece index
}

export interface IPushParams {}

export const Const = {
  roomSize: 2,
  matrixSize: 3
}
