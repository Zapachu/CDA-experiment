export const namespace = 'EgretDoubleAuction'

export const Config = {
    ROUND : 3,
    PREPARE_TIME : 5,
    TRADE_TIME : 120,
    RESULT_TIME : 10,
    PLAYER_NUM : 6
}

export enum GameScene {
    prepare,
    trade,
    result
}

export enum Role {
    seller,
    buyer
}

export enum MoveType {
    getIndex = 'getIndex',
    shout = 'shout'
}

export enum PushType {
    beginRound
}

export interface ICreateParams {
}

export interface IMoveParams {
    price: number,
}

export interface IPushParams {
    round:number
}

export interface IGameState {
    prepareTime: number
    roundIndex: number
    rounds: IGameRoundState[]
    playerIndex: number
    scene: GameScene
}

export interface IShout {
    role: Role,
    price: number,
    traded?: boolean
}

export interface ITrade {
    reqIndex: number
    resIndex: number
    price: number
}

export interface IGameRoundState {
    time: number
    shouts: IShout[]
    trades: ITrade[]
}

export interface IPlayerState {
    role: Role
    privatePrices: number[]
    index: number
    profits: number[]
}