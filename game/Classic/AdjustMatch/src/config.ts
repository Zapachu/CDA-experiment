export const namespace = 'AdjustMatch'

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
    result: number[]
    oldFlag: boolean[]
}

export interface IGameState {
    round: number
    rounds: IGameRoundState[]
}

export enum PlayerStatus {
    guide,
    round,
    result
}

export interface IPlayerRoundState {
    privatePrices: number[]
}

export interface IPlayerState {
    index: number
    status: PlayerStatus
    rounds: IPlayerRoundState[]
}