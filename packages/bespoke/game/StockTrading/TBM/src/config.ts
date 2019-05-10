export const namespace = 'TBM'

export enum MoveType {
    shout = 'shout',
    prepare = 'prepare',
    getPosition = 'getPosition'
}

export enum PushType {
    dealTimer,
    startBid,
    newRoundTimer,
    nextRound
}

export enum FetchType {

}

export enum PlayerStatus {
    outside,
    prepared,
    shouted,
    gameOver,
}

export const NEW_ROUND_TIMER = 3


// role 0 : buyer 1: seller
