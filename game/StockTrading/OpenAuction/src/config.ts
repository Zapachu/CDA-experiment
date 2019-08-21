export const namespace = 'OpenAuction'

export const ROUNDS = 3

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

export interface IGameRoundState {
    startPrice: number
    shouts: Array<number>
    timer: number
    traded: boolean
}

export interface IGameState {
    playerIndex: number
    rounds: Array<IGameRoundState>
    round: number
}

export enum PlayerStatus {
    guide,
    test,
    play
}

export interface IPlayerRoundState {
    privatePrice: number
    status: PlayerStatus
}

export interface IPlayerState {
    index: number
    rounds: Array<IPlayerRoundState>
}