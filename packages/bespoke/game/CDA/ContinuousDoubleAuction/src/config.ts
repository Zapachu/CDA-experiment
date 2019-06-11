export const namespace = 'ContinuousDoubleAuction'

export enum ROLE {
    Seller,
    Buyer
}

export enum IDENTITY {
    Player,
    ZipRobot,
    GDRobot
}

export enum AdjustDirection {
    raise,
    lower
}

export enum TRADE {
    success = 1
}

export enum TRADE_TYPE {
    buyerFirst = 1,
    sellerFirst = 2
}

export enum EVENT_TYPE {
    rejected = 1,
    entered,
    traded,
    cancelled
}

export interface EventParams {
    orderId?: number,
    period: number,
    subject: number,
    box: number,
    role: ROLE,
    traderType: IDENTITY,
    valueCost: number,
    eventType: EVENT_TYPE,
    eventNum: number,
    eventTime: Date,
    eventEndTime?: Date,
    maxBid: number,
    minAsk: number,
    matchEventNum?: number,
    bidAsk: number,
    trade?: TRADE,
    tradeOrder?: number,
    tradeTime?: Date,
    tradeType?: TRADE_TYPE,
    price?: number,
    profit?: number,
    partnerSubject?: number,
    partnerBox?: number,
    partnerShout?: number,
    partnerProfit?: number,
    partnerId?: number,
}

export const orderNumberLimit = 10000

export enum SheetType {
    seatNumber = 'seatNumber',
    result = 'result',
    log = 'log',
    profit = 'profit',
    robotCalcLog = 'robotCalcLog',
    robotSubmitLog = 'robotSubmitLog',
}

export enum MarketStage {
    notOpen,
    readDescription,
    trading,
    result
}

export enum PlayerStatus {
    wait4Position,
    wait4MarketOpen,
    trading,
    left
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

export interface ISeatNumberRow {
    playerSeq,
    seatNumber
}

export enum ShoutResult {
    shoutSuccess,
    tradeSuccess,
    marketReject,
    shoutOnTradedUnit,
}

export enum DBKey {
    moveEvent = 'moveEvent',
    robotCalcLog = 'robotCalcLog',
    robotSubmitLog = 'robotSubmitLog',
    seatNumber = 'seatNumber',
}

export const RedisKey = {
    robotActionSeq: (gameId: string) => `robotCalcSeq:${gameId}`
}

export const phaseNames = {
    assignPosition: 'assignPosition',
    mainGame: 'mainGame',
    marketResult: 'marketResult',
}

export enum MoveType {
    //player
    enterMarket = 'enterMarket',
    submitOrder = 'submitOrder',
    rejectOrder = 'rejectOrder',
    cancelOrder = 'cancelOrder',
    //owner
    assignPosition = 'assignPosition',
    openMarket = 'openMarket',
    //elf
    sendBackPlayer = 'sendBackPlayer'
}

export enum PushType {
    assignedPosition = 'assignedPosition',
    periodCountDown = 'periodCountDown',
    periodOpen = 'periodOpen',
    newOrder = 'newOrder',
    newTrade = 'newTrade'
}

export enum FetchRoute {
    exportXls = '/exportXls/:gameId'
}

export enum ReactionType {
    TradeAndOrder,
    TradeOnly
}
