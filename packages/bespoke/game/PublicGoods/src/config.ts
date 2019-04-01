export const namespace = 'PublicGoods'

export enum MoveType {
    shout = 'shout',
    getPosition = 'getPosition',
}

export enum PushType {
    newRoundTimer
}

export enum FetchType {

}

export enum PlayerStatus {
    prepared,
    timeToShout,
    shouted,
    gameOver
}

export const NEW_ROUND_TIMER = 3
