export const namespace = 'TogetherBidMarket'

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
    gameOver,
}

export const NEW_ROUND_TIMER = 3
