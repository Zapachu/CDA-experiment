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
    unitIndex,
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
    unitIndex,
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
    shoutOnTradedUnit,
}

export enum DBKey {
    robotCalcLog = 'robotCalcLog',
    robotSubmitLog = 'robotSubmitLog',
}

export const RedisKey = {
    robotActionSeq: (gameId: string) => `robotCalcSeq:${gameId}`
}

export enum MoveType {
    getGroup = 'getGroup',
    leaveGroup = 'newGroup',
    submitOrder = 'submitOrder',
    cancelOrder = 'cancelOrder',
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

export enum GroupType {
    Single,
    Multi
}

export const MATCH_TIME = 30

export interface IUnit {
    price: number
    count: number
}

export interface ICreateParams {
    roles: number[]
    prepareTime: number
    tradeTime: number
    units: IUnits[]
}

export interface IUnits {
    units: IUnit[]
}

export interface IGameGroupState {
    stage: number
    orderId: number
    orders: IOrder[]
    buyOrderIds: number[]
    sellOrderIds: number[]
    trades: ITrade[]
    roleIndex: number
    type: number
}

export interface IOrder {
    id: number
    roleIndex: number
    unitIndex: number
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
    groups: IGameGroupState[]
}

export interface IPlayerGroupState {
    roleIndex: number
    units: IUnit[]
    tradedCount: number
    point: number
}

export interface IPlayerState {
    groups: IPlayerGroupState[]
    groupIndex: number
}

export type IMoveParams = Partial<{
    groupType: number
    unitIndex: number
    price: number
    count: number
}>

export type IPushParams = Partial<{
    countDown: number
    newOrderId: number
    resOrderId: number
}>
