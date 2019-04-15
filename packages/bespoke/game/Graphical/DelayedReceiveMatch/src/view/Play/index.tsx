import * as React from 'react'
import {Core} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../../interface'
import {FetchType, MoveType, PushType} from '../../config'

interface IPlayState {

}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {
    render(): React.ReactNode {
        return 'Play'
    }
}
