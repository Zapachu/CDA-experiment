export enum Role {
    owner,
    player
}

export enum RequestMethod {
    get = 'get',
    post = 'post'
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