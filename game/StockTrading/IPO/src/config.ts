export const namespace = 'IPO'

export enum MoveType {
    guideDone = 'guideDone',
    getIndex = 'getIndex',
    shout = 'shout',
    nextGame = 'nextGame'
}

export enum PushType {
    shoutTimer
}

export enum PlayerStatus {
    guide,
    test,
    prepared,
    shouted,
    result
}

export enum IPOType {
    Median = 1,
    TopK,
    FPSBA
}

export interface ICreateParams {
    groupSize: number
    total: number
    type: IPOType
}

export interface IMoveParams {
    price: number
    num: number
    onceMore: boolean
}

export interface IPushParams {
    matchTimer: number
    matchNum: number
    min: number
    max: number
    startingPrice: number
    shoutTimer: number
}

export interface IGameState {
    playerNum: number
    strikePrice?: number
    min?: number
    max?: number
    stockIndex?: number
}

export interface IPlayerState {
    index: number
    playerStatus: number
    privateValue: number
    price: number
    bidNum: number
    actualNum: number
    profit: number
    startingPrice: number
}

export interface InvestorState {
    privateValue: number;
    price: number;
    bidNum: number;
    actualNum?: number;
    profit?: number;
}

export interface MarketState {
    strikePrice?: number;
    min: number;
}

export const SHOUT_TIMER = 60
export const minA = 30
export const maxA = 100
export const minB = 0.6
export const maxB = 0.7
export const startingMultiplier = 5000
export const minNPCNum = 1000
export const maxNPCNum = 3000
