import * as React from 'react';
import {config} from '@bespoke/share';
import {Core} from '@bespoke/client';
import {stringify} from 'query-string';
import {namespace} from '../config';

type TProps = Core.IPlayProps<any, any, any, any, any, any, any>

export function Play(props: TProps) {
    const {game, playerState} = props
    return <iframe style={{
        width: '100vw',
        height: '100vh',
        display: 'block'
    }} frameBorder={0} src={`/${config.rootName}/${namespace}/egret?${stringify({
        gameId: game.id,
        token: playerState.actor.token
    })}`}/>
}
