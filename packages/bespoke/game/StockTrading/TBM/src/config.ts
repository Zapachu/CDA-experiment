export const namespace = 'TBM'

export enum MoveType {
    shout = 'shout',
    prepare = 'prepare',
    getPosition = 'getPosition',
    nextStage = 'nextStage',
    startMulti = 'startMulti',
    joinRobot = 'joinRobot',

}

export enum PushType {
    matchTimer,
    startBid,
    newRoundTimer,
    nextRound,
}

export enum PlayerStatus {
    matching,
    prepared,
    shouted,
    result,
}

export const NEW_ROUND_TIMER = 3

// role 0 : buyer 1: seller
