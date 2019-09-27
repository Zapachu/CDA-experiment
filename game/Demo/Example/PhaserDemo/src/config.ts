export const namespace = 'PhaserDemo';

export enum Direction {U, R, D, L}

export enum MoveType {
    move
}

export enum PushType {
    move
}

export interface ICreateParams {
}

export interface IMoveParams {
    d: Direction
}

export interface IPushParams {
    token: string
    d: Direction
}

export interface IGameState {
}

export interface IPlayerState {
}
