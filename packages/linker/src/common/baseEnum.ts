//region common
export enum Language {
    chinese = 'chinese',
    english = 'english'
}

export enum AcademusRole {
    student = 0,
    teacher = 1
}

export enum AcademusResCode {
    success = 0,
    err = 1
}

export enum Role {
    owner,
    player
}

export enum RequestMethod {
    get = 'get',
    post = 'post'
}

export enum ResponseCode {
    invalidInput,
    success,
    notFound,
    serverError
}

export enum Actor {
    owner = 'o',
    player = 'p'
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

//region elf-linker
export enum GameMode {
    easy = 'easy',
    extended = 'extended'
}

export enum SocketEvent {
    connection = 'connection',
    disconnect = 'disconnect',
    upFrame = 'upFrame',
    downFrame = 'downFrame'
}

export enum PhaseStatus {
    playing,
    paused,
    closed
}

export enum PlayerStatus {
    playing,
    left
}

//endregion
