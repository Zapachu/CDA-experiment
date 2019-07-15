export const namespace = 'TheHunterGame'

export enum MoveType {
    shout = 'shout',
    getPosition = 'getPosition',
}

export enum PushType {
}

export enum PlayerStatus {
    waiting,
    prepared,
    shouted,
    completed,
}

export enum Prey {
    None,
    Deer,
    Rabbit
}
