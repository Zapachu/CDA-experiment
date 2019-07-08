export enum Role {
    owner,
    player
}

export enum RequestMethod {
    get = 'get',
    post = 'post'
}

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