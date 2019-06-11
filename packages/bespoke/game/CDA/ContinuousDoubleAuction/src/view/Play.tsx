import * as React from 'react'
import {Core} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {MoveType, PushType} from '../config'
import {phaseTemplates} from './phase'

export const Play: Core.PlaySFC<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> =
    ({game, gameState, playerState, frameEmitter}) => {
        const {templateName} = game.params.phases[gameState.gamePhaseIndex],
            {Play} = phaseTemplates.find(({name}) => name === templateName)
        return <Play key={`${templateName}-${gameState.gamePhaseIndex}`}
                     {...{
                         game,
                         gameState,
                         playerState,
                         frameEmitter
                     }}/>
    }

