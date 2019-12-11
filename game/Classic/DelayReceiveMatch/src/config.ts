import { RoundDecorator } from '@extend/share'

export const namespace = 'DelayReceiveMatch'

export const CONFIG = {
  tradeSeconds: 30,
  resultSeconds: 5
}

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export enum MoveType {
  guideDone = 'guideDone',
  submit = 'submit'
}

export enum PushType {}

export interface IMoveParams {
  sort: number[]
}

export interface IPushParams {}

export type ICreateParams = RoundDecorator.ICreateParams<IRoundCreateParams>

export interface IRoundCreateParams {
  goodAmount: number
  minPrivateValue: number
  maxPrivateValue: number
}

export interface IGameRoundState {
  timeLeft: number
  allocation: number[]
}

export type IGameState = RoundDecorator.IGameState<IGameRoundState>

export enum PlayerRoundStatus {
  play,
  wait,
  result
}

export interface IPlayerRoundState {
  privatePrices: number[]
  sort: number[]
  status: PlayerRoundStatus
}

export enum PlayerStatus {
  guide,
  round,
  result
}

export type IPlayerState = RoundDecorator.IPlayerState<IPlayerRoundState>
