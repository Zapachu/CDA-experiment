import { RoundDecorator } from '@extend/share'

export const namespace = 'GoodExchange'

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export enum RoundMoveType {
  exchange
}

export enum PushType {}

export interface IRoundMoveParams {
  good: number
}

export interface IPushParams {}

export interface IRoundCreateParams {
  t: number
  buyerAmount: number
  privatePriceMatrix: number[][]
}

export enum ExchangeStatus {
  null,
  waiting,
  exchanged
}

export interface IRoundGameState {
  timeLeft: number
  exchangeMatrix: ExchangeStatus[][]
  allocation: number[]
}

export interface IRoundPlayerState {}

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
