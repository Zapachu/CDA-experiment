export enum UserGameStatus {
    beforeStart,
    waittingMatch,
    started,
    end
}

export enum ResCode {
    success = 0,
    unexpectError = -1
}

export enum serverSocketListenEvents {
    reqStartGame = 'reqStartGame',
    leaveMatchRoom = 'leaveMatchRoom'
}

export enum clientSocketListenEvnets {
    startMatch = 'startMatch',
    startGame = 'startGame',
}