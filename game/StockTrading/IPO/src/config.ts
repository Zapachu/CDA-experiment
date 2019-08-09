export const namespace = 'IPO'

export enum MoveType {
    guideDone = 'guideDone',
    getIndex = 'getIndex',
    shout = 'shout',
    nextGame = 'nextGame'
}

export enum PushType {
    shoutTimer
}

export enum PlayerStatus {
    guide,
    test,
    prepared,
    shouted,
    result
}

export enum IPOType {
    Median = 1,
    TopK,
    FPSBA
}

export const SHOUT_TIMER = 60e3
export const minA = 30
export const maxA = 100
export const minB = 0.6
export const maxB = 0.7
export const startingMultiplier = 5000
export const minNPCNum = 1000
export const maxNPCNum = 3000
