export const namespace = 'TBM'

export enum MoveType {
    shout = 'shout',
    prepare = 'prepare',
    getPosition = 'getPosition',
    nextStage = 'nextStage',
    startSingle = 'startSingle',
    startMulti = 'startMulti'

}

export enum PushType {
    dealTimer,
    startBid,
    newRoundTimer,
    nextRound,
    matchingTimer
}

export enum FetchType {

}

export enum PlayerStatus {
    intro,
    outside,
    matching,
    prepared,
    startBid,
    shouted,
    gameOver,
}

export const NEW_ROUND_TIMER = 3


// role 0 : buyer 1: seller
