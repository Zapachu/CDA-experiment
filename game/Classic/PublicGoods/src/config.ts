export const namespace = 'PublicGoods'

export enum MoveType {
    getPosition = 'getPosition',
    submit = 'submit'
}

export enum PushType {
    newRoundTimer
}

export enum PlayerStatus {
    prepared,
    submitted,
    result
}

export enum FetchRoute {
    exportXls = "/exportXls/:gameId:",
    exportXlsPlaying = "/exportXlsPlaying/:gameId",
    getUserInfo = "/getUserInfo/:gameId"
}

export const NEW_ROUND_TIMER = 5
