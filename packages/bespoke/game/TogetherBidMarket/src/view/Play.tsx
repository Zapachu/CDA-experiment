import * as React from 'react'
import * as style from './style.scss'
import {Core} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchType, MoveType, PushType} from '../config'

interface IPlayState {
    loading: boolean
    price: string,
    dealTimers: Array<number>,
    newRoundTimers: Array<number>
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {

    render() {
        return <section className={style.play}>

        </section>
    }

}
