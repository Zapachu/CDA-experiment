export const namespace = 'TheTragedyOfTheCommonsGraphical'

export enum MoveType {
    prepare = 'prepare',
    shout = 'shout',
    getPosition = 'getPosition',
    toNextRound = 'toNextRound',
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
    nextRound,
    preparedNextRound,
    gameOver,
}

export const NEW_ROUND_TIMER = 3
