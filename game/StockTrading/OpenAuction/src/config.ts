export const namespace = 'OpenAuction'

export const PriceRange = {
    start: {
        min: 50,
        max: 70
    },
    private: {
        min: 70,
        max: 120
    }
}

export const RobotCfg = {
    startDelay: 5,
    maxAmount: 5
}

export enum MoveType {
    guideDone,
    testDone,
    shout,
    exit
}

export enum PushType {
}

export interface IMoveParams {
    price: number
    onceMore: boolean
}

export interface IPushParams {
}

export interface ICreateParams {
}

export interface IGameState {
    startPrice: number
    playerIndex: number
    shouts: Array<number>
    timer: number
    traded: boolean
}

export enum PlayerStatus {
    guide,
    test,
    play
}

export interface IPlayerState {
    privatePrice: number
    status: PlayerStatus
    index: number
}