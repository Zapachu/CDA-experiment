import * as React from 'react'
import {FetchType, MoveType, PushType} from '../../config'
import {
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
        updateParams?: (newParams: ICreateParams) => void
    }, S> {

        checkParams({lang, params: {}}): boolean {
            return true
        }

        render() {
            return null
        }
    }

    export interface BaseInfoProps {
        params: ICreateParams
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
}
