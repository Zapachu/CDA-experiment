export const namespace = 'DelayReceiveMatch'

export const CONFIG = {
  tradeSeconds: 30,
  resultSeconds: 5
}

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export enum MoveType {
  guideDone,
  submit
}

export enum PushType {}

export interface IMoveParams {
  sort: number[]
}

export interface IPushParams {}

export interface ICreateParams {
  round: number
  goodAmount: number
  minPrivateValue: number
  maxPrivateValue: number
}

export interface IGameRoundState {
  timeLeft: number
  allocation: number[]
}

export interface IGameState {
  round: number
  rounds: IGameRoundState[]
}

export enum PlayerRoundStatus {
  play,
  wait,
  result
}

export interface IPlayerRoundState {
  privatePrices: number[]
  sort: number[]
  status: PlayerRoundStatus
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
