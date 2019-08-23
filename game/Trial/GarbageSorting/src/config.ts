export const namespace = 'GarbageSorting'

export enum MoveType {
    prepare = 'prepare',
    check = 'check',
    shout = 'shout',
    back = 'back'
}

export enum PushType {
    robotShout,
    shoutTimer
}

export interface ICreateParams {
    groupSize: number;
}

export interface IMoveParams {
    answer: GARBAGE;
    index: number;
    onceMore: boolean;
}

export interface IPushParams {
    shoutTimer: number;
}

export interface IGameState {
    sortedPlayers: Array<{
        score: number;
        img: string;
    }>;
    totalScore: number;
}

export interface IPlayerState {
    score: number;
    contribution: number;
    flyTo: GARBAGE;
    answers: Array<GARBAGE>;
}

export enum GARBAGE {
    pass = 1,
    recyclable,
    kitchen,
    other,
    hazardous
}

export enum ITEM_NAME {
    battery,
    bone,
    bottle,
    bulb,
    clothing,
    earthenwareBowl,
    mud,
    popCan,
    tissue,
    vegetableLeaf
}

export const GARBAGE_LABEL = {
    [GARBAGE.pass]: '懒得分类',
    [GARBAGE.recyclable]: '可回收垃圾',
    [GARBAGE.kitchen]: '厨余垃圾',
    [GARBAGE.other]: '其它垃圾',
    [GARBAGE.hazardous]: '有害垃圾'
}

export const ITEMS = [
    {img: ITEM_NAME.battery},
    {img: ITEM_NAME.bone},
    {img: ITEM_NAME.bottle},
    {img: ITEM_NAME.bulb},
    {img: ITEM_NAME.clothing},
    {img: ITEM_NAME.earthenwareBowl},
    {img: ITEM_NAME.mud},
    {img: ITEM_NAME.popCan},
    {img: ITEM_NAME.tissue},
    {img: ITEM_NAME.vegetableLeaf}
]

export const SHOUT_TIMER = 10
export const ITEM_COST = 10
export const TOTAL_SCORE = 20 * 10 * 10
