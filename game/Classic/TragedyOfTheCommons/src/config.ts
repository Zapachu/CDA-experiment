export const namespace = 'TragedyOfTheCommons'

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export enum RoundMoveType {
  submit
}

export enum PushType {}

export interface IRoundMoveParams {
  x: number
}

export interface IPushParams {}

export interface IRoundCreateParams {
  t: number
  M: number
  K: number
}

export interface IRoundGameState {
  timeLeft: number
  reward?: number
  xArr: number[]
}

export enum PlayerRoundStatus {
  play,
  wait,
  result
}

export interface IRoundPlayerState {
  status: PlayerRoundStatus
}

import { RoundDecorator } from '@extend/share'

export type GroupMoveType = RoundDecorator.TGroupMoveType<RoundMoveType>
export type IGroupMoveParams = RoundDecorator.IGroupMoveParams<IRoundMoveParams>
export type IGroupCreateParams = RoundDecorator.IGroupCreateParams<IRoundCreateParams>
export type IGroupGameState = RoundDecorator.IGroupGameState<IRoundGameState>
export type IGroupPlayerState = RoundDecorator.IGroupPlayerState<IRoundPlayerState>
