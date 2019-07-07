import * as React from 'react'
import * as style from './style.scss'
import {Core} from '@bespoke/register'
import {ICreateParams, IGameState, IPlayerState} from '../interface'
import GameResult from './components/GameResult'

export class Result extends Core.Result<ICreateParams, IGameState, IPlayerState> {

    render(): React.ReactNode {
        const {props: {playerState:{correctNumber, point}}} = this
        return <section className={style.result}>
            <GameResult correctNumber={correctNumber} point={point}/>
        </section>
    }
}
