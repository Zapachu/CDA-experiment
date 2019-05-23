export const namespace = 'StockTrading-CBM'

export enum ROLE {
    Seller,
    Buyer
}

export enum AdjustDirection {
    raise,
    lower
}

export enum SheetType {
    robotCalcLog = 'robotCalcLog',
    robotSubmitLog = 'robotSubmitLog',
}

export enum GameStage {
    matching,
    trading,
    over
}

export enum PeriodStage {
    reading,
    trading,
    result
}

export interface RobotCalcLog {
    seq,
    playerSeq,
    role,
    R,
    A,
    q,
    tau,
    beta,
    p,
    delta,
    r,
    LagGamma,
    Gamma,
    ValueCost,
    u,
    CalculatedPrice,
    timestamp
}

export interface RobotSubmitLog {
    seq,
    playerSeq,
    role,
    ValueCost,
    price,
    buyOrders,
    sellOrders,
    timestamp,
    shoutResult: ShoutResult,
    marketBuyOrders,
    marketSellOrders,
}

export enum ShoutResult {
    shoutSuccess,
    tradeSuccess,
    marketReject,
    invalidCount,
}

export enum DBKey {
    robotCalcLog = 'robotCalcLog',
    robotSubmitLog = 'robotSubmitLog',
}

export const RedisKey = {
    robotActionSeq: (gameId: string) => `robotCalcSeq:${gameId}`
}

export enum MoveType {
    getIndex = 'getIndex',
    submitOrder = 'submitOrder',
    cancelOrder = 'cancelOrder'
}

export enum PushType {
    countDown = 'countDown',
    beginTrading = 'beginTrading',
    newOrder = 'newOrder',
    newTrade = 'newTrade'
}

export enum FetchType {
    exportXls = 'exportXls'
}

export const MATCH_TIME = 5
export const PERIOD = 6

export const MOCK = {
    price: 200,
    count: 100,
    point: 20000
}

export const CONFIG = {
    playerLimit: 12,
    prepareTime: 30,
    tradeTime: 180
}

export interface ICreateParams {
}

export interface IOrder {
    id: number
    playerIndex: number
    role: ROLE
    price: number
    count: number
}

export interface ITrade {
    reqOrderId: number
    resOrderId: number
    count: number
    subOrderId?: number
}

export interface IGamePeriodState {
    stage: PeriodStage
    orders: IOrder[]
    buyOrderIds: number[]
    sellOrderIds: number[]
    trades: ITrade[]
}

export interface IGameState {
    periods: IGamePeriodState[]
    stage: GameStage
    playerIndex: number
    periodIndex: number
}

export interface IPlayerState {
    playerIndex: number
    count: number
    point: number
}

export type IMoveParams = Partial<{
    role: ROLE
    price: number
    count: number
}>

export type IPushParams = Partial<{
    countDown: number
    newOrderId: number
    resOrderId: number
}>
