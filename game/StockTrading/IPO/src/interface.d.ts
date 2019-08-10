import {IPOType} from './config'

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
    index:number
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