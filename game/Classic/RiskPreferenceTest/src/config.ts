export const namespace = 'RiskPreferenceTest'

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export const TRange: [number, number] = [5, 10]

export enum MoveType {
  guideDone,
  submit
}

export enum PushType {}

export enum Choice {
  A,
  B
}

export interface IMoveParams {
  preference: Choice[]
}

export interface IPushParams {}

export const awardLimit = 100

export interface ICreateParams {
  round: number
  t: number
  awardA: number
  awardB: number
}

export interface IGameRoundState {
  timeLeft: number
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
  status: PlayerRoundStatus
  T: number
  preference?: Choice[]
  result?: {
    caseIndex: number
    success: boolean
    award: number
  }
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
