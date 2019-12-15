import { RoundDecorator } from '@extend/share'

export const namespace = 'CallAuction'

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

export interface IOrder {
  player: number
  price: number
}

export interface ITrade {
  buy: IOrder
  sell: IOrder
}

export interface IRoundGameState {
  timeLeft: number
  trades: Array<ITrade>
}

export enum PlayerRoundStatus {
  play,
  wait,
  result
}

export interface IRoundPlayerState {
  price: number
  status: PlayerRoundStatus
}

export type GroupMoveType = RoundDecorator.TMoveType<RoundMoveType>
export type IGroupMoveParams = RoundDecorator.IMoveParams<IRoundMoveParams>
export type IGroupCreateParams = RoundDecorator.ICreateParams<IRoundCreateParams>
export type IGroupGameState = RoundDecorator.IGameState<IRoundGameState>
export type IGroupPlayerState = RoundDecorator.IPlayerState<IRoundPlayerState>
