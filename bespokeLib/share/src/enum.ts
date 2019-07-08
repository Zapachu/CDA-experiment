export enum SocketEvent {
    //region baseEvent
    connection = 'connection',
    disconnect = 'disconnect',
    online = 'online',
    move = 'move',
    push = 'push',
    sendBack = 'sendBack',
    //endregion
    //region stateEvent
    syncGameState_json = 'SGJ',
    syncPlayerState_json = 'SPJ',
    changeGameState_diff = 'CGD',
    changePlayerState_diff = 'CPD',
    //endregion
}

export enum CoreMove {
    switchGameStatus = 'switchGameStatus'
}

export enum GameStatus {
    started,
    paused,
    over
}

export enum SyncStrategy {
    default,
    diff
}
