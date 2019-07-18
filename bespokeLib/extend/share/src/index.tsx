export const RANGE = {
    group: {
        min: 1,
        max: 8
    },
    groupSize: {
        min: 2,
        max: 8
    }
}

export namespace Wrapper {
    export enum GroupMoveType {
        getGroup = 'getGroup'
    }

    export type MoveType<MoveType> = MoveType | GroupMoveType

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