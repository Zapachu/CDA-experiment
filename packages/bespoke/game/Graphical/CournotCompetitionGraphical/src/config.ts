export const namespace = 'CournotCompetitionGraphical'

export enum MoveType {
    enterMarket = 'enterMarket',
    shout = 'shout',
    getPosition = 'getPosition',
    nextRound = 'nextRound'
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
    next
}

export const DEAL_TIMER = 5
export const NEW_ROUND_TIMER = 5
