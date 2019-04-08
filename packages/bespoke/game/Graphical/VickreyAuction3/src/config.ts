export const namespace = 'VickreyAuction3'

export enum MoveType {
    enterMarket = 'enterMarket',
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
    won
}

export const DEAL_TIMER = 3
export const NEW_ROUND_TIMER = 10
