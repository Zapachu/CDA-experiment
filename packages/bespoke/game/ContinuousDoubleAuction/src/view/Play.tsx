import * as React from 'react'
import {Core} from 'bespoke-client'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchType, MoveType, PushType} from '../config'
import {phaseTemplates} from './phase'

export const Play: Core.PlaySFC<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> =
    ({game, gameState, playerState, fetcher, frameEmitter}) => {
        const {templateName} = game.params.phases[gameState.gamePhaseIndex],
            {Play} = phaseTemplates.find(({name}) => name === templateName)
        return <Play key={`${templateName}-${gameState.gamePhaseIndex}`}
                     {...{
                         fetcher,
                         game,
                         gameState,
                         playerState,
                         frameEmitter
                     }}/>
    }

