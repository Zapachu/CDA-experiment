import * as React from 'react'
import * as style from './style.scss'
import {FetchType, MoveType, PushType} from '../../config'
import {
    CreateParams,
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams
} from '../../interface'
import {MaskLoading, Fetcher, FrameEmitter, IGame} from 'bespoke-client-util'

export namespace BasePhase {

    export class Create<S = {}> extends React.Component<BaseInfoProps & {
        fetcher: Fetcher<FetchType>
        updateParams?: (newParams: Partial<CreateParams.Phase.IParams>) => void
    }, S> {
        constructor(public phases) {
            super(phases)
        }

        checkParams({lang, params: {}}): boolean {
            return true
        }

        render() {
            return <div className={style.blankMsg}>NO PARAM TO CONFIG</div>
        }
    }

    export interface BaseInfoProps {
        params: CreateParams.Phase.IParams,
        phases: Array<CreateParams.IPhase>
    }

    export class Info extends React.Component<BaseInfoProps> {
        render() {
            return <div className={style.blankMsg}>NO CONFIGURATION</div>
        }
    }

    export class Play<S = {}> extends React.Component<{
        fetcher: Fetcher<FetchType>
        game: IGame<ICreateParams>
        gameState: IGameState
        playerState: IPlayerState
        frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
    }, S> {
        render() {
            return <MaskLoading/>
        }
    }

    export interface IPhaseTemplate {
        name: string
        Create?: new(...args) => Create
        Info?: new(...args) => Info
        Play: new(...args) => Play
    }
}