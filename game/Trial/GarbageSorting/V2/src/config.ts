export const namespace = 'GarbageSortingV2';

export enum GarbageType {
    harmful,
    kitchen,
    recyclable,
    other
}

export enum MoveType {
    sort
}

export enum PushType {
    sort
}

export interface ICreateParams {
}

export interface IMoveParams {
    t: GarbageType
}

export interface IPushParams {
    token: string
    t: GarbageType
}

export interface IGameState {
}

export interface IPlayerState {
}
