export const namespace = 'StockTrading-CBM'

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
    getIndex = 'getIndex',
    submitOrder = 'submitOrder',
    cancelOrder = 'cancelOrder',
    exitGame = 'exitGame'
}

export enum PushType {
    countDown = 'countDown',
    beginTrading = 'beginTrading'
}

export enum FetchType {
}

export const PERIOD = 6

export const CONFIG = {
    prepareTime: 30,
    tradeTime: 180,
    resultTime: 30
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
        point: number
    }
}

export interface IPlayerState {
    playerIndex: number
    privatePrices: number[]
    count: number
    point: number
}

export type IMoveParams = Partial<{
    role: ROLE
    price: number
    count: number
    onceMore: boolean
}>

export type IPushParams = Partial<{
    countDown: number
    newOrderId: number
    resOrderId: number
}>
