export const namespace = 'DoubleAuctionGraphical'

export enum MoveType {
    prepare = 'prepare',
    shout = 'shout',
    getPosition = 'getPosition',
}

export enum PushType {
    newRoundTimer
}

export enum FetchType {

}

export enum PlayerStatus {
    outside,
    prepared,
    shouted,
    dealed,
    gameOver,
}

export const NEW_ROUND_TIMER = 3
