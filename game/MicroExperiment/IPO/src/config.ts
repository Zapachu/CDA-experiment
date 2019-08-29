import {NCreateParams} from '@micro-experiment/share'
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
    round: 3,
    groupSize: 6,
    tradeTime: 60,
    marketStockAmount: 1e4,
    secondsToShowResult:5,
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
    startRound,
    shoutTimer
}

export type ICreateParams = NCreateParams.IPO

export interface IMoveParams {
    price: number
    num: number
    onceMore: boolean
}

export interface IPushParams {
    shoutTimer: number
}

export interface IGameRoundState {
    stockIndex: number
    minPrice: number
    maxPrice: number
    tradePrice: number
}

export interface IGameState {
    playerNum: number
    rounds: Array<IGameRoundState>
    round: number
}

export interface IPlayerRoundState {
    status: number
    privateValue: number
    price: number
    bidNum: number
    actualNum: number
    profit: number
    startMoney: number
}

export interface IPlayerState {
    index: number
    rounds: Array<IPlayerRoundState>
}