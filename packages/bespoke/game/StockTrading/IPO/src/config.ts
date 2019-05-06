export const namespace = 'IPO'

export enum MoveType {
    startSinglePlayer = 'startSinglePlayer',
    shout = 'shout',
    getPosition = 'getPosition',
    nextRound = 'nextRound'
}

export enum PushType {
    matchTimer,
    matchMsg,
    robotShout
}

export enum FetchType {

}

export enum PlayerStatus {
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
