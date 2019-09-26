export const namespace = 'TragedyOfTheCommons';

export enum FetchRoute {
    exportXls = '/exportXls/:gameId'
}

export enum MoveType {
    guideDone,
    submit,
}

export enum PushType {
}

export interface IMoveParams {
    x: number
}

export interface IPushParams {
}

export interface ICreateParams {
    round: number
    t: number
    M: number
    K: number
}

export interface IGameRoundState {
    timeLeft: number
    reward?: number
    xArr: number[]
}

export interface IGameState {
    round: number
    rounds: IGameRoundState[]
}

export enum PlayerRoundStatus {
    play,
    wait,
    result
}

export interface IPlayerRoundState {
    status: PlayerRoundStatus
}

export enum PlayerStatus {
    guide,
    round,
    result
}

export interface IPlayerState {
    status: PlayerStatus
    rounds: IPlayerRoundState[]
}