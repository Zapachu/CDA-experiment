import * as React from 'react'
import {FrameEmitter, IGameWithId, TGameState, TPlayerState} from '@bespoke/share'

export namespace Group {
    export interface ICreateProps<ICreateParams> {
        params: Partial<ICreateParams>
        setParams: (params: Partial<ICreateParams> | ((prevParams: ICreateParams) => Partial<ICreateParams>)) => void
    }

    export class Create<ICreateParams, S = {}> extends React.Component<ICreateProps<ICreateParams>, S> {
    }

    export interface IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
        game: IGameWithId<ICreateParams>,
        frameEmitter?: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
        gameState: TGameState<IGameState>
        playerState: TPlayerState<IPlayerState>
    }

    export class Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
        extends React.Component<IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>, S> {
    }
}