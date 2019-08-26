import {FrameEmitter, IGameWithId, TGameState, TPlayerState} from '@bespoke/share'

export const GroupRange = {
    group: {
        min: 1,
        max: 8
    },
    groupSize: {
        min: 1,
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

    export type TPlayerState<IPlayerState>  = IPlayerState & {
        index: number
    }

    export interface IPlayerState<IPlayerState> {
        groupIndex: number
        state: TPlayerState<IPlayerState>
    }
}

export namespace Extractor {
    export function game<P>(game: IGameWithId<Wrapper.ICreateParams<P>>, groupIndex: number): IGameWithId<P> {
        const {params, ...extraGame} = game
        return {...extraGame, ...params[groupIndex]}
    }

    export function frameEmitter<MoveType, PushType, IMoveParams, IPushParams>(frameEmitter: FrameEmitter<MoveType, PushType, Wrapper.IMoveParams<IMoveParams>, IPushParams>, groupIndex: number): FrameEmitter<MoveType, PushType, IMoveParams, IPushParams> {
        const f = Object.create(frameEmitter)
        f.emit = (moveType, params, cb) => frameEmitter.emit(moveType, {groupIndex, params}, cb)
        return f
    }

    export function gameState<S>(gameState: TGameState<Wrapper.IGameState<S>>, groupIndex: number): TGameState<S> {
        const {groups, ...extraGameState} = gameState
        return {...groups[groupIndex].state, ...extraGameState}
    }

    export function playerState<S>(playerState: TPlayerState<Wrapper.IPlayerState<S>>): TPlayerState<S> {
        const {state, ...extraPlayerState} = playerState
        return {...extraPlayerState, ...state}
    }

    export function playerStates<IPlayerState>(playerStates: { [token: string]: TPlayerState<Wrapper.IPlayerState<IPlayerState>> }, groupIndex: number): { [token: string]: TPlayerState<IPlayerState> } {
        const r: { [token: string]: TPlayerState<IPlayerState> } = {}
        Object.values(playerStates).forEach(playerState => {
            if (playerState.groupIndex !== groupIndex) {
                return
            }
            r[playerState.actor.token] = Extractor.playerState(playerState)
        })
        return r
    }
}