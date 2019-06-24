export const namespace = "TBM";

export enum Role {
  Buyer = 1,
  Seller = 2
}

export enum MoveType {
  join = "join",
  shout = "shout",
  nextStage = "nextStage"
}

export enum PushType {
  robotShout,
  shoutTimer
}

export interface ICreateParams {
  groupSize: number;
  buyerCapitalMin: number;
  buyerCapitalMax: number;
  buyerPrivateMin: number;
  buyerPrivateMax: number;
  sellerQuotaMin: number;
  sellerQuotaMax: number;
  sellerPrivateMin: number;
  sellerPrivateMax: number;
}

export interface IMoveParams {
  price: number;
  num: number;
  onceMore: boolean;
}

export interface IPushParams {
  shoutTime: number;
}

export interface IGameState {
  strikePrice: number;
  strikeNum: number;
  stockIndex: number;
}

export interface IPlayerState {
  startingPrice: number;
  startingQuota: number;
  privateValue: number;
  role: Role;
  price: number;
  bidNum: number;
  actualNum: number;
  profit: number;
}

export const SHOUT_TIMER = 60;
export const NPC_PRICE_MIN = 50;
export const NPC_PRICE_MAX = 60;
