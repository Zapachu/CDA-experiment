import {NCreateParams, Phase} from '@micro-experiment/share'

export const namespace = Phase.CBM

export enum ROLE {
    Seller,
    Buyer
}

export enum PeriodStage {
    reading,
    trading,
    result
}

export enum MoveType {
    guideDone = 'guideDone',
    getIndex = 'getIndex',
    submitOrder = 'submitOrder',
    cancelOrder = 'cancelOrder',
    repayMoney = 'repayMoney',
    repayCount = 'repayCount',
    exitGame = 'exitGame'
}

export enum PushType {
    countDown = 'countDown',
    beginTrading = 'beginTrading',
    closeOutWarning = 'closeOutWarning',
    closeOut = 'closeOut',
    newOrder = 'newOrder',
    newTrade = 'newTrade',
    tradeSuccess = 'tradeSuccess'
}

export const PERIOD = 6

export const CONFIG = {
    prepareTime: 5,
    tradeTime: 180,
    resultTime: 30
}

export type ICreateParams  = NCreateParams.CBM

export interface IOrder {
    id: number
    playerIndex: number
    role: ROLE
    price: number
    count: number
    guarantee: boolean
}

export interface ITrade {
    reqOrderId: number
    resOrderId: number
    count: number
    subOrderId?: number
}

export enum GameType {
    rise,
    fall,
    riseFall,
    fallRise
}

export const PrivatePriceRegion: { [key: number]: [number, number][] } = {
    [GameType.rise]: [[25, 75], [30, 80], [35, 85], [40, 90], [45, 95], [50, 100]],
    [GameType.fall]: [[50, 100], [45, 95], [40, 90], [35, 85], [30, 80], [25, 75]],
    [GameType.riseFall]: [[25, 75], [30, 80], [35, 85], [35, 85], [30, 80], [25, 75]],
    [GameType.fallRise]: [[35, 85], [30, 80], [25, 75], [25, 75], [30, 80], [35, 85]]
}

export interface IGamePeriodState {
    stage: PeriodStage
    orders: IOrder[]
    buyOrderIds: number[]
    sellOrderIds: number[]
    trades: ITrade[]
    closingPrice: number
    balancePrice: number
}

export interface IGameState {
    type: GameType
    periods: IGamePeriodState[]
    periodIndex: number
    playerIndex: number
    initialAsset: {
        count: number
        money: number
    }
}

export enum Identity {
    retailPlayer,
    moneyGuarantor,
    stockGuarantor
}

export enum PlayerStatus {
    guide,
    test,
    play
}

export interface IPlayerState {
    status: PlayerStatus
    playerIndex: number
    identity: Identity
    privatePrices: number[]
    count: number
    money: number
    guaranteeCount: number
    guaranteeMoney: number
}

export type IMoveParams = Partial<{
    role: ROLE
    price: number
    count: number
    guarantee: boolean
    onceMore: boolean
    moneyRepay: number
    countRepay: number
}>

export type IPushParams = Partial<{
    countDown: number
    newOrderId: number
    resOrderId: number
    tradeCount: number
}>

export const playerLimit = 12

export enum AdjustDirection {
    raise,
    lower
}
