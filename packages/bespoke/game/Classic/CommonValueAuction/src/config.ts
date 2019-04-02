export const namespace = 'CommonValueAuction'

export enum MoveType {
    shout = 'shout',
    getPosition = 'getPosition'
}

export enum PushType {
    dealTimer,
    newRoundTimer
}

export enum FetchType {

}

export enum PlayerStatus {
    outside,
    prepared,
    shouted,
    won,
    gameOver
}

export const NEW_ROUND_TIMER = 3
