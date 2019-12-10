export const namespace = 'AdjustMatch'

export const CONFIG = {
  tradeSeconds: 30,
  resultSeconds: 5
}

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export enum MoveType {
  guideDone,
  overPrePlay,
  submit
}

export enum PushType {}

export interface IMoveParams {
  join: boolean
  sort: number[]
}

export interface IPushParams {}

export interface ICreateParams {
  round: number
  oldPlayer: number
  minPrivateValue: number
  maxPrivateValue: number
}

export enum GoodStatus {
  new,
  old,
  left
}

export interface IGameRoundState {
  timeLeft: number
  initAllocation: number[]
  overPrePlay: boolean[]
  allocation: number[]
  goodStatus: GoodStatus[]
}

export interface IGameState {
  round: number
  rounds: IGameRoundState[]
}

export enum PlayerRoundStatus {
  prePlay,
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
