import * as React from 'react'
import {Core, config} from 'bespoke-client-util'
import {stringify} from 'querystring'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchType, MoveType, PushType, namespace} from '../config'

type TProps = Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>

export function Play({game, playerState}: TProps) {
    return <iframe style={{
        width: '100vw',
        height: '100vh',
        display: 'block'
    }} frameBorder={0} src={`/${config.rootName}/${namespace}/egret?${stringify({
        namespace: game.namespace,
        gameId: game.id,
        token: playerState.actor.token
    })}`}/>
}
