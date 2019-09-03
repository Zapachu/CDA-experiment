import {Phase} from '@micro-experiment/share'
export const namespace = Phase.TBM

export const DEFAULT_PARAMS: ICreateParams = {
    groupSize: 12,
    buyerCapitalMin: 50000,
    buyerCapitalMax: 100000,
    buyerPrivateMin: 65,
    buyerPrivateMax: 80,
    sellerQuotaMin: 1000,
    sellerQuotaMax: 2000,
    sellerPrivateMin: 30,
    sellerPrivateMax: 45
}

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
    status: PlayerStatus
    startingPrice: number;
    startingQuota: number;
    privateValue: number;
    role: Role;
    price: number;
    bidNum: number;
    actualNum: number;
    profit: number;
}

export const SHOUT_TIMER = 60
export const NPC_PRICE_MIN = 50
export const NPC_PRICE_MAX = 60
