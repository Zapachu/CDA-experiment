export const namespace = 'TBM'

export enum MoveType {
    shout = 'shout',
    prepare = 'prepare',
    getPosition = 'getPosition'
}

export enum PushType {
    dealTimer,
    startBid,
    newRoundTimer
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
