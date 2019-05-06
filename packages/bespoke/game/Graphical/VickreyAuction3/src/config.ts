export const namespace = 'VickreyAuction'

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
