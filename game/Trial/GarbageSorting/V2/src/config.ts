export const namespace = 'GarbageSortingV2';

export enum GarbageType {
    harmful,
    kitchen,
    recyclable,
    other,
    skip
}

export const CONFIG = {
    maxLife: 100,
    maxEnv: 100,
    garbageAmount: 10
}

export enum MoveType {
    submit
}

export enum PushType {
    sync
}

export interface ICreateParams {
}

export interface IMoveParams {
    i: number
    t: GarbageType
}

export interface IPushParams extends IGameState, IPlayerState{
    token: string
    t: GarbageType
}

export interface IGameState {
    env: number
}

export enum PlayerStatus{
    play,
    wait
}

export interface IPlayerState {
    status:PlayerStatus
    life: number
    garbageIndex:number
}
