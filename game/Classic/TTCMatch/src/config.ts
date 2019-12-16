import { RoundDecorator } from '@extend/share'

export const namespace = 'TTCMatch'

export const CONFIG = {
  resultSeconds: 5
}

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export enum RoundMoveType {
  submit
}

export enum PushType {}

export interface IRoundMoveParams {
  sort: number[]
}

export interface IPushParams {}

export interface IRoundCreateParams {
  privatePriceMatrix: number[][]
}

export interface IRoundGameState {
  initAllocation: number[]
  allocation: number[]
}

export enum PlayerRoundStatus {
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
