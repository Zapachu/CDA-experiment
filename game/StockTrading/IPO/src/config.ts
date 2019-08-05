export const namespace = 'IPO'

export enum MoveType {
    shout = 'shout',
    getIndex = 'getIndex',
    nextGame = 'nextGame'
}

export enum PushType {
    shoutTimer
}

export enum PlayerStatus {
    intro,
    prepared,
    shouted,
    result
}

export enum IPOType {
    Median = 1,
    TopK
}

export const SHOUT_TIMER = 60
export const minA = 30
export const maxA = 100
export const minB = 0.6
export const maxB = 0.7
export const startingMultiplier = 5000
export const minNPCNum = 1000
export const maxNPCNum = 3000
