import * as React from 'react'
import {Extend} from '@extend/register'
import {Button} from 'antd'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from '../config'

class InnerPlay extends Extend.Inner.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    render(): React.ReactNode {
        const {game, playerState, gameState, frameEmitter} = this.props
        return <>
            <h2>{playerState.count}</h2>
            <h2>{gameState.total}</h2>
            <Button onClick={() => frameEmitter.emit(MoveType.add)}>Add</Button>
        </>
    }
}

export class Play extends Extend.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    InnerPlay = InnerPlay
}