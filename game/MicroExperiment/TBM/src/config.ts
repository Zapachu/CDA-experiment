import { NCreateParams, Phase } from '@micro-experiment/share'
export const namespace = Phase.TBM

export enum PlayerStatus {
  guide,
  test,
  play
}

export enum Role {
  Buyer = 1,
  Seller = 2
}

export enum MoveType {
  guideDone = 'guideDone',
  join = 'join',
  shout = 'shout',
  nextStage = 'nextStage'
}

export enum PushType {
  robotShout,
  shoutTimer
}

export type ICreateParams = NCreateParams.TBM

export interface IMoveParams {
  price: number
  num: number
  onceMore: boolean
}

export interface IPushParams {
  shoutTime: number
}

export interface IGameState {
  strikePrice: number
  strikeNum: number
  stockIndex: number
}

export interface IPlayerState {
  status: PlayerStatus
  startingPrice: number
  startingQuota: number
  privateValue: number
  role: Role
  price: number
  bidNum: number
  actualNum: number
  profit: number
}

export const SHOUT_TIMER = 60
export const NPC_PRICE_MIN = 50
export const NPC_PRICE_MAX = 60
