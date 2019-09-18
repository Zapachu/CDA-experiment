import * as React from 'react';
import {Core, Request} from '@bespoke/client';
import {FetchRoute, ICreateParams, IGameState, IMoveParams, IPlayerState, MoveType, namespace} from '../config';

export function Result4Owner({game}: Core.IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams>) {
    return <a href={Request.instance(namespace).buildUrl(FetchRoute.exportXls, {gameId: game.id}, {
        group: 0,
        round: 0
    })}>导出</a>;
}