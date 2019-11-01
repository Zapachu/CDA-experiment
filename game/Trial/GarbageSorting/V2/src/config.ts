export const namespace = 'GarbageSortingV2';

export enum GarbageType {
    harmful,
    kitchen,
    recyclable,
    other,
    skip
}

export const Garbage: Array<{ label: string, type: GarbageType }> = [
    {label: '白菜', type: GarbageType.kitchen},
    {label: '灯泡', type: GarbageType.kitchen},
    {label: '电池', type: GarbageType.kitchen},
    {label: '骨头', type: GarbageType.kitchen},
    {label: '灰土', type: GarbageType.kitchen},
    {label: '陶碗', type: GarbageType.kitchen},
    {label: '衣服', type: GarbageType.kitchen},
    {label: '纸巾', type: GarbageType.kitchen},
    {label: '矿泉水', type: GarbageType.kitchen},
    {label: '易拉罐', type: GarbageType.kitchen},
];

export const CONFIG = {
    groupSize: 10,
    maxLife: 100,
    sortCost: 10,
    sortSeconds: 5,
    maxEnv: 1000,
    pollutionOfSkip: 10,
    pollutionOfWrong: 5,
    rightScore: 10,
    skipScore: -10
};

export enum MoveType {
    prepare,
    submit
}

export enum PushType {
    prepare,
    sync
}

export interface ICreateParams {
}

export interface IMoveParams {
    i: number
    t: GarbageType
}

export interface IPushParams extends IMoveParams, IPlayerState {
    env: number
}

export interface IGameState {
    env: number
    playerNum: number
    sorts: GarbageType[][]
}

export enum PlayerStatus {
    play,
    result
}

export interface IPlayerState {
    index: number
    status: PlayerStatus
    life: number
    garbageIndex: number
}
