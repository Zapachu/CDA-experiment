export const namespace = 'VickreyAuction3'

export enum MoveType {
    enterMarket = 'enterMarket',
    shout = 'shout',
    getPosition = 'getPosition'
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
    won
}

export const DEAL_TIMER = 5
export const NEW_ROUND_TIMER = 5
