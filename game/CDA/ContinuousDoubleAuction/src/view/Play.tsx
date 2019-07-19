import * as React from 'react'
import {Core} from '@bespoke/client'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {MoveType, PushType} from '../config'
import {phaseTemplates} from './phase'

export function Play({game, gameState, playerState, frameEmitter}: Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
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

