export const namespace = 'GoodExchange'

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export enum MoveType {
  guideDone,
  exchange
}

export enum PushType {}

export interface IMoveParams {
  good: number
}

export interface IPushParams {}

export interface ICreateParams {
  round: number
  t: number
  minPrivateValue: number
  maxPrivateValue: number
}

export enum ExchangeStatus {
  null,
  waiting,
  exchanged
}

export interface IGameRoundState {
  timeLeft: number
  exchangeMatrix: ExchangeStatus[][]
  allocation: number[]
}

export interface IGameState {
  round: number
  rounds: IGameRoundState[]
}

export interface IPlayerRoundState {
  privatePrices: number[]
}

export enum PlayerStatus {
  guide,
  round,
  result
}

export interface IPlayerState {
  status: PlayerStatus
  rounds: IPlayerRoundState[]
}
