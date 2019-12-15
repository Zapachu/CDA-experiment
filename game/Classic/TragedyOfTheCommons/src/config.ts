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

export type GroupMoveType = RoundDecorator.TMoveType<RoundMoveType>
export type IGroupMoveParams = RoundDecorator.IMoveParams<IRoundMoveParams>
export type IGroupCreateParams = RoundDecorator.ICreateParams<IRoundCreateParams>
export type IGroupGameState = RoundDecorator.IGameState<IRoundGameState>
export type IGroupPlayerState = RoundDecorator.IPlayerState<IRoundPlayerState>
