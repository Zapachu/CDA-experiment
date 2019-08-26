export const namespace = 'Extend'

export enum MoveType {
    add = 'add',
    reset = 'reset'
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