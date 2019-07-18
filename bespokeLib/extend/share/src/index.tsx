export * from './const'

export module Extend {
    export enum MoveType {
        getGroup = 'getGroup'
    }

    export interface ICreateParams<ICreateParams> {
        group: number
        groupSize: number
        groupsParams: ICreateParams[]
    }


    export interface IMoveParams<IMoveParams> {
        groupIndex: number
        params: IMoveParams
    }

    export interface IGameState<IGameState> {
        groups: Array<{
            playerNum: number
            state: IGameState
        }>
    }

    export interface IPlayerState<IPlayerState> {
        groupIndex: number
        state: IPlayerState
    }
}