import { RoundDecorator } from '@extend/share'

export const namespace = 'AdjustMatch'

export const CONFIG = {
  resultSeconds: 5
}

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export enum RoundMoveType {
  overPrePlay,
  submit
}

export enum PushType {}

export interface IRoundMoveParams {
  join: boolean
  sort: number[]
}

export interface IPushParams {}

export interface IRoundCreateParams {
  oldPlayer: number
  privatePriceMatrix: number[][]
}

export enum GoodStatus {
  new,
  old,
  left
}

export interface IRoundGameState {
  initAllocation: number[]
  overPrePlay: boolean[]
  allocation: number[]
  goodStatus: GoodStatus[]
}

export enum PlayerRoundStatus {
  prePlay,
  play,
  wait,
  result
}

export interface IRoundPlayerState {
  sort: number[]
  status: PlayerRoundStatus
}

export enum PlayerStatus {
  guide,
  round,
  result
}

export type GroupMoveType = RoundDecorator.TGroupMoveType<RoundMoveType>
export type IGroupMoveParams = RoundDecorator.IGroupMoveParams<IRoundMoveParams>
export type IGroupCreateParams = RoundDecorator.IGroupCreateParams<IRoundCreateParams>
export type IGroupGameState = RoundDecorator.IGroupGameState<IRoundGameState>
export type IGroupPlayerState = RoundDecorator.IGroupPlayerState<IRoundPlayerState>
