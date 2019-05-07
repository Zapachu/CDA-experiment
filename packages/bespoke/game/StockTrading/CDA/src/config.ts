export const namespace = 'StockTrading-CDA'

export enum ROLE {
    Seller,
    Buyer
}

export enum AdjustDirection {
    raise,
    lower
}

export const orderNumberLimit = 10000

export enum SheetType {
    seatNumber = 'seatNumber',
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

export enum FetchType {
    exportXls = 'exportXls'
}
