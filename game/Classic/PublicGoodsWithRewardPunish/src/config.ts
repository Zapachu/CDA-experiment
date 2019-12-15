export const namespace = 'PublicGoodsWithRewardPunish'

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export enum RoundMoveType {
  submit
}

export enum PushType {}

export interface IRoundMoveParams {
  x: number
  d: number
}

export interface IPushParams {}

export enum Mode {
  normal,
  reward,
  punish
}

export interface IRoundCreateParams {
  t: number
  M: number
  K: number
  mode: Mode
  P: number
}

export interface IRoundGameState {
  timeLeft: number
  reward?: number
  players: Array<{
    x: number
    d: number
    extra: number
  }>
}

export enum PlayerRoundStatus {
  play,
  wait,
  result
}

export interface IRoundPlayerState {
  status: PlayerRoundStatus
}

export enum PlayerStatus {
  guide,
  round,
  result
}

import { RoundDecorator } from '@extend/share'

export type GroupMoveType = RoundDecorator.TMoveType<RoundMoveType>
export type IGroupMoveParams = RoundDecorator.IMoveParams<IRoundMoveParams>
export type IGroupCreateParams = RoundDecorator.ICreateParams<IRoundCreateParams>
export type IGroupGameState = RoundDecorator.IGameState<IRoundGameState>
export type IGroupPlayerState = RoundDecorator.IPlayerState<IRoundPlayerState>
