export enum UserGameStatus {
    waittingMatch,
    started,
    notStarted
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
    continueGame = 'continueGame',
    handleError = 'handleError' 
}