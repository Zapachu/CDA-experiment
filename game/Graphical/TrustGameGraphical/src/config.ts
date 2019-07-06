export const namespace = 'TrustGameGraphical'

export enum MoveType {
    prepare = 'prepare',
    toNextRound = 'toNextRound',
    shout = 'shout',
    getPosition = 'getPosition',
}

export enum PushType {
    newRoundTimer
}

export enum PlayerStatus {
    outside,
    prepared,
    timeToShout,
    shouted,
    nextRound,
    preparedNextRound,
    gameOver,
    memberFull,
}

export const NEW_ROUND_TIMER = 3
