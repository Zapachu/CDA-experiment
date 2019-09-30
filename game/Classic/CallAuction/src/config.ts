export const namespace = 'CallAuction';

export enum FetchRoute {
    exportXls = '/exportXls/:gameId'
}

export enum MoveType {
    guideDone,
    shout,
}

export enum PushType {
}

export interface IMoveParams {
    price: number
}

export interface IPushParams {
}

export interface ICreateParams {
    round: number
    t: number
    buyPriceRange: [number, number],
    sellPriceRange: [number, number]
}

export interface IOrder {
    player: number
    price: number
}

export interface ITrade {
    buy: IOrder
    sell: IOrder
}

export interface IGameRoundState {
    timeLeft: number
    trades: Array<ITrade>
}

export enum Role {
    buyer,
    seller
}

export interface IGameState {
    round: number
    rounds: IGameRoundState[]
}

export enum PlayerRoundStatus {
    play,
    wait,
    result
}

export interface IPlayerRoundState {
    price: number
    status: PlayerRoundStatus
}

export enum PlayerStatus {
    guide,
    round,
    result
}

export interface IPlayerState {
    role: Role
    status: PlayerStatus
    privatePrices: number[]
    rounds: IPlayerRoundState[]
}
