export const namespace = 'Extend'

export enum MoveType {
    add,
    reset
}

export enum PushType {
}

export interface IMoveParams {
}

export interface IPushParams {
}

export interface ICreateParams {
    goal: number
}

export interface IGameState {
    total: number
}

export interface IPlayerState {
    count: number
}