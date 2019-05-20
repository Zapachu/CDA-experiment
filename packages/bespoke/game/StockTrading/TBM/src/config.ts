export const namespace = 'TBM'

export enum MoveType {
    shout = 'shout',
    prepare = 'prepare',
    getPosition = 'getPosition',
    nextStage = 'nextStage',
    startSingle = 'startSingle',
    startMulti = 'startMulti',
    joinRobot = 'joinRobot',

}

export enum PushType {
    matchTimer,
    shoutTimer,
    dealTimer,
    startBid,
    newRoundTimer,
    nextRound,
    matchingTimer
}

export enum FetchType {

}

export enum PlayerStatus {
    intro,
    outside,
    matching,
    prepared,
    startBid,
    shouted,
    result,
    gameOver,
}

export const NEW_ROUND_TIMER = 3
export const SHOUT_TIMER = 60


// role 0 : buyer 1: seller
