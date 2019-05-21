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

export enum Stage {
    matching,
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
    getPeriod = 'getPeriod',
    leavePeriod = 'newPeriod',
    setRole = 'setRole',
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

export enum PeriodType {
    Single,
    Multi
}

export const MATCH_TIME = 5

export const MOCK = {
    playerLimit: 18,
    price: 200,
    count: 100,
    point: 20000
}

export interface ICreateParams {
    prepareTime: number
    tradeTime: number
}

export interface IGamePeriodState {
    stage: number
    orderId: number
    orders: IOrder[]
    buyOrderIds: number[]
    sellOrderIds: number[]
    trades: ITrade[]
    playerIndex: number
    type: PeriodType
    marketPrice: number
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

export interface IGameState {
    periods: IGamePeriodState[]
}

export interface IPlayerPeriodState {
    playerIndex: number
    role?: ROLE
}

export interface IPlayerState {
    periods: IPlayerPeriodState[]
    periodIndex: number
    count: number
    point: number
}

export type IMoveParams = Partial<{
    periodType: number
    role: ROLE
    price: number
    count: number
}>

export type IPushParams = Partial<{
    countDown: number
    newOrderId: number
    resOrderId: number
}>
