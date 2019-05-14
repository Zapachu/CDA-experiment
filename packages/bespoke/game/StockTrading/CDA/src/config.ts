export const namespace = 'StockTrading-CDA'

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

export const MATCH_TIME = 5
