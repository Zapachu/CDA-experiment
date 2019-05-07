export const namespace = 'IPO'

export enum MoveType {
    startSinglePlayer = 'startSinglePlayer',
    shout = 'shout',
    startMultiPlayer = 'startMultiPlayer',
    nextGame = 'nextGame',
    replay = 'replay',
}

export enum PushType {
    matchTimer,
    matchMsg,
    robotShout
}

export enum FetchType {

}

export enum PlayerStatus {
    intro,
    matching,
    prepared,
    shouted,
    result
}

export enum IPOType {
    Median = 1,
    TopK
}

export const MATCH_TIMER = 30
export const minA = 30;
export const maxA = 100;
export const minB = .6;
export const maxB = .7;
export const startingMultiplier = 5000;
export const minNPCNum = 1000;
export const maxNPCNum = 3000;

