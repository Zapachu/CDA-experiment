export const namespace = 'AdjustMatch'

export const CONFIG = {
    tradeSeconds: 30,
    resultSeconds: 5,
}

export enum MoveType {
    guideDone,
    submit
}

export enum PushType {
}

export interface IMoveParams {
    sort: number[]
}

export interface IPushParams {
}

export interface ICreateParams {
    round: number
    oldPlayer: number
    newPlayer: number
    minPrivateValue: number
    maxPrivateValue: number
}

export interface IGameRoundState {
    timeLeft:number
    result: number[]
    oldFlag: boolean[]
}

export interface IGameState {
    round: number
    rounds: IGameRoundState[]
}

export enum PlayerRoundStatus {
    prepare,
    wait,
    result
}

export interface IPlayerRoundState {
    privatePrices: number[]
    sort:number[]
    status: PlayerRoundStatus
}

export enum PlayerStatus {
    guide,
    round,
    result
}

export interface IPlayerState {
    index: number
    status: PlayerStatus
    rounds: IPlayerRoundState[]
}