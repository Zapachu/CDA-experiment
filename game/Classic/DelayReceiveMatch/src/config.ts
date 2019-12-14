import { RoundDecorator } from '@extend/share'

export const namespace = 'DelayReceiveMatch'

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export enum RoundMoveType {
  submit = 'submit'
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

export type GroupMoveType = RoundDecorator.TMoveType<RoundMoveType>
export type IGroupMoveParams = RoundDecorator.IMoveParams<IRoundMoveParams>
export type IGroupCreateParams = RoundDecorator.ICreateParams<IRoundCreateParams>
export type IGroupGameState = RoundDecorator.IGameState<IRoundGameState>
export type IGroupPlayerState = RoundDecorator.IPlayerState<IRoundPlayerState>
