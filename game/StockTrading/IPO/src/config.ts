export const namespace = 'IPO'

export const PriceRange = {
    limit: {
        min: 50,
        max: 70
    },
    minRatio: {
        min: .6,
        max: .7
    }
}
export const BuyNumberRange = {
    baseCount: 5000,
    robotMin: 1000,
    robotMax: 3000
}
export const CONFIG = {
    tradeTime: 60,
    groupSize: 6,
    marketStockAmount: 1e4
}

export enum IPOType {
    Median,
    TopK,
    FPSBA
}

export enum PlayerStatus {
    guide,
    test,
    prepared,
    shouted,
    result
}

export enum MoveType {
    guideDone = 'guideDone',
    getIndex = 'getIndex',
    shout = 'shout',
    nextGame = 'nextGame'
}

export enum PushType {
    shoutTimer
}

export interface ICreateParams {
    type: IPOType
}

export interface IMoveParams {
    price: number
    num: number
    onceMore: boolean
}

export interface IPushParams {
    shoutTimer: number
}

export interface IGameState {
    stockIndex: number
    playerNum: number
    minPrice: number
    maxPrice: number
    tradePrice: number
}

export interface IPlayerState {
    index: number
    status: number
    privateValue: number
    price: number
    bidNum: number
    actualNum: number
    profit: number
    startMoney: number
}