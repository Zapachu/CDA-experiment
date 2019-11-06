export const namespace = 'GarbageSortingV2';

export enum GarbageType {
    harmful,
    kitchen,
    recyclable,
    other,
    skip
}

export const GarbageConfig: Array<{ label: string, type: GarbageType }> = [
    {label: '白菜', type: GarbageType.kitchen},
    {label: '灯泡', type: GarbageType.recyclable},
    {label: '电池', type: GarbageType.harmful},
    {label: '骨头', type: GarbageType.kitchen},
    {label: '灰土', type: GarbageType.other},
    {label: '陶碗', type: GarbageType.other},
    {label: '衣服', type: GarbageType.recyclable},
    {label: '纸巾', type: GarbageType.recyclable},
    {label: '矿泉水', type: GarbageType.recyclable},
    {label: '易拉罐', type: GarbageType.recyclable},
];

export const CONFIG = {
    groupSize: 10,
    maxLife: 100,
    sortCost: 10,
    sortSeconds: 10,
    maxEnv: 1000,
    pollutionOfSkip: 12,
    pollutionOfWrong: 8,
    rightScore: 20,
    wrongScore: 5
};

export enum MoveType {
    prepare,
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
