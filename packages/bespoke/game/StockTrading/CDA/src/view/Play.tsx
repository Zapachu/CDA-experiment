import * as React from 'react'
import {Core} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchType, MarketStage, MoveType, PushType} from '../config'
import {assignPosition, mainGame, marketResult} from './phase'

export const Play: Core.PlaySFC<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> =
    ({game, gameState, playerState, fetcher, frameEmitter}) => {
        switch (gameState.marketStage) {
            case MarketStage.assignPosition:
                return <assignPosition.Play {...{
                    fetcher,
                    game,
                    gameState,
                    playerState,
                    frameEmitter
                }}/>
            case MarketStage.leave:
                return <marketResult.Play {...{
                    fetcher,
                    game,
                    gameState,
                    playerState,
                    frameEmitter
                }}/>
            default:
                return <mainGame.Play {...{
                    fetcher,
                    game,
                    gameState,
                    playerState,
                    frameEmitter
                }}/>
        }
    }

