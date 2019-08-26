import * as React from 'react'
import * as Extend from '@extend/client'
import {ICreateParams, IGameState, IPlayerState} from '../config'

class GroupResult extends Extend.Group.Result<ICreateParams, IGameState, IPlayerState> {
    render(): React.ReactNode {
        const {playerState, gameState} = this.props
        return <>
        </>
    }
}

export class Result extends Extend.Result<ICreateParams, IGameState, IPlayerState> {
    GroupResult = GroupResult
}