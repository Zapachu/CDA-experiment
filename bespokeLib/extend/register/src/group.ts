import {Wrapper} from '@extend/share'
import {FrameEmitter, IGameWithId, TGameState, TPlayerState} from '@bespoke/share'
import {Core} from '@bespoke/register'

export namespace TransProps {
    export function params<P>(params: Core.TCreateParams<Wrapper.ICreateParams<P>>, groupIndex: number): Core.TCreateParams<P> {
        return params.groupsParams[groupIndex]
    }

    export function setParams<P>(setParams: Core.TSetCreateParams<Wrapper.ICreateParams<P>>, groupIndex: number): Core.TSetCreateParams<P> {
        return (action: React.SetStateAction<P>) =>
            setParams((prevParams => {
                const groupsParams = prevParams.groupsParams.slice(),
                    prevGroupParams = groupsParams[groupIndex]
                groupsParams[groupIndex] = {...prevGroupParams, ...typeof action === 'function' ? (action as (prevState: P) => P)(prevGroupParams) : action}
                return {groupsParams}
            }))
    }

    export function game<P>(game: IGameWithId<Wrapper.ICreateParams<P>>, groupIndex: number): IGameWithId<P> {
        const {params, ...extraGame} = game
        return {...extraGame, ...params[groupIndex]}
    }

    export function frameEmitter<MoveType, PushType, IMoveParams, IPushParams>(frameEmitter: FrameEmitter<MoveType, PushType, Wrapper.IMoveParams<IMoveParams>, IPushParams>, groupIndex: number): FrameEmitter<MoveType, PushType, IMoveParams, IPushParams> {
        const f = Object.create(frameEmitter)
        f.emit = (moveType, params, cb) => frameEmitter.emit(moveType, {groupIndex, params}, cb)
        return f
    }

    export function playerState<S>(playerState: TPlayerState<Wrapper.IPlayerState<S>>): TPlayerState<S> {
        const {state, ...extraPlayerState} = playerState
        return {...extraPlayerState, ...state}
    }

    export function gameState<S>(gameState: TGameState<Wrapper.IGameState<S>>, groupIndex: number): TGameState<S> {
        const {groups, ...extraGameState} = gameState
        return {...groups[groupIndex].state, ...extraGameState}
    }

    export function playerStates<IPlayerState>(playerStates: { [token: string]: TPlayerState<Wrapper.IPlayerState<IPlayerState>> }, groupIndex: number): { [token: string]: TPlayerState<IPlayerState> } {
        const r: { [token: string]: TPlayerState<IPlayerState> } = {}
        Object.values(playerStates).forEach(playerState => {
            if (playerState.groupIndex !== groupIndex) {
                return
            }
            r[playerState.actor.token] = TransProps.playerState(playerState)
        })
        return r
    }
}

export {Core as Group} from '@bespoke/register'
