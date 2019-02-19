//region common
export enum Language {
    chinese,
    english
}

export enum Role {
    owner,
    player
}

export enum LogLevel {
    log,
    trace,
    debug,
    info,
    warn,
    error,
    fatal
}

//endregion

//region elf-phase
export enum SocketEvent {
    connection = 'connection',
    disconnect = 'disconnect',
    online = 'online',
    sendBack = 'sendBak',
    move = 'upFrame',
    push = 'downFrame'
}

export enum MoveType {
    switchGameStatus = 'switchGameStatus'
}

export enum GameStatus {
    notStarted,
    started,
    paused,
    over
}

export enum PlayerStatus {
    playing,
    wait4otherPlayer,
    wait4gameOver
}

//endregion