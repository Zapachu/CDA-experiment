export const namespace = 'PublicGoods'

export enum MoveType {
    enterMarket = 'enterMarket',
    shout = 'shout',
    getPosition = 'getPosition',
    timeToShout = 'timeToShout',
}

export enum PushType {
    newRoundTimer
}

export enum FetchType {

}

export enum PlayerStatus {
    outside,
    prepared,
    timeToShout,
    shouted,
    won
}

export const NEW_ROUND_TIMER = 3
