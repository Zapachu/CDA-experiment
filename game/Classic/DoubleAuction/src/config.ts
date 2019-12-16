import { RoundDecorator } from '@extend/share'

export const namespace = 'DoubleAuction'

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export enum RoundMoveType {
  shout
}

export enum PushType {}

export interface IRoundMoveParams {
  price: number
}

export interface IPushParams {}

export interface IRoundCreateParams {
  t: number
  buyerAmount: number
  buyPriceMatrix: number[][]
  sellPriceMatrix: number[][]
}

export interface IShout {
  role: Role
  price: number
  tradePair?: number
}

export interface ITrade {
  reqIndex: number
  resIndex: number
  price: number
}

export interface IRoundGameState {
  timeLeft: number
  shouts: IShout[]
  trades: ITrade[]
}

export enum PlayerRoundStatus {
  play,
  wait,
  result
}

export interface IRoundPlayerState {
  status: PlayerRoundStatus
  price: number
  profit: number
}

export enum PlayerStatus {
  guide,
  round,
  result
}

export enum Role {
  seller,
  buyer
}

export type GroupMoveType = RoundDecorator.TGroupMoveType<RoundMoveType>
export type IGroupMoveParams = RoundDecorator.IGroupMoveParams<IRoundMoveParams>
export type IGroupCreateParams = RoundDecorator.IGroupCreateParams<IRoundCreateParams>
export type IGroupGameState = RoundDecorator.IGroupGameState<IRoundGameState>
export type IGroupPlayerState = RoundDecorator.IGroupPlayerState<IRoundPlayerState>
