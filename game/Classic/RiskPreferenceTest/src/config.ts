import { RoundDecorator } from '@extend/share'

export const namespace = 'RiskPreferenceTest'

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export const TRange: [number, number] = [5, 10]

export enum RoundMoveType {
  submit
}

export enum PushType {}

export enum Choice {
  A,
  B
}

export interface IRoundMoveParams {
  preference: Choice[]
}

export interface IPushParams {}

export const awardLimit = 100

export interface IRoundCreateParams {
  t: number
  awardA: number
  awardB: number
}

export interface IRoundGameState {
  timeLeft: number
}

export enum PlayerRoundStatus {
  play,
  wait,
  result
}

export interface IRoundPlayerState {
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

export type GroupMoveType = RoundDecorator.TMoveType<RoundMoveType>
export type IGroupMoveParams = RoundDecorator.IMoveParams<IRoundMoveParams>
export type IGroupCreateParams = RoundDecorator.ICreateParams<IRoundCreateParams>
export type IGroupGameState = RoundDecorator.IGameState<IRoundGameState>
export type IGroupPlayerState = RoundDecorator.IPlayerState<IRoundPlayerState>
