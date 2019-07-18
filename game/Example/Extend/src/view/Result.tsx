import * as React from 'react'
import {Extend} from '@extend/register'
import {ICreateParams, IGameState, IPlayerState} from '../config'

class GroupResult extends Extend.Group.Result<ICreateParams, IGameState, IPlayerState> {
    render(): React.ReactNode {
        const {playerState, gameState} = this.props
        return <>
            <h2>{playerState.count}</h2>
            <h2>{gameState.total}</h2>
        </>
    }
}

export class Result extends Extend.Result<ICreateParams, IGameState, IPlayerState> {
    GroupResult = GroupResult
}