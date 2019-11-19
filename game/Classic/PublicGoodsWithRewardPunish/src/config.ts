export const namespace = 'PublicGoodsWithRewardPunish'

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export enum MoveType {
  guideDone,
  submit
}

export enum PushType {}

export interface IMoveParams {
  x: number
  d: number
}

export interface IPushParams {}

export enum Mode {
  normal,
  reward,
  punish
}

export interface ICreateParams {
  round: number
  t: number
  M: number
  K: number
  mode: Mode
  P: number
}

export interface IGameRoundState {
  timeLeft: number
  reward?: number
  players: Array<{
    x: number
    d: number
    extra: number
  }>
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
