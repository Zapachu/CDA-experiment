export const namespace = 'VickreyAuction'

export enum MoveType {
    //player
    enterMarket = 'enterMarket',
    shout = 'shout',
    getPosition = 'getPosition'
}

export enum PushType {
    playerEnter,
    someoneShout,
    win,
    newRound
}

export const RedisKey = {
    frameSeq: (gameId: string) => `frameSeq:${gameId}`
}