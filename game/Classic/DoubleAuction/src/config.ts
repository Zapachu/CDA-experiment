export const namespace = 'DoubleAuction';

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

export interface IShout {
    role: Role,
    price: number,
    tradePair?: number
}

export interface ITrade {
    reqIndex: number
    resIndex: number
    price: number
}


export interface IGameRoundState {
    timeLeft: number
    shouts: IShout[]
    trades: ITrade[]
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
    status: PlayerRoundStatus
    privatePrice: number
    profit: number
}

export enum PlayerStatus {
    guide,
    round,
    result
}

export enum Role {
    seller,
    buyer
}

export interface IPlayerState {
    status: PlayerStatus
    role: Role
    rounds: IPlayerRoundState[]
}
