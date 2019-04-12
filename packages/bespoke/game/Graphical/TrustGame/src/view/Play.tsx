import * as React from 'react'
import {Core, Lang} from 'bespoke-client-util'
import {Stage, span, Host} from 'bespoke-game-graphical-util'
import {
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams
} from '../../../../Classic/TrustGame/src/interface'
import {FetchType, MoveType, PushType} from '../../../../Classic/TrustGame/src/config'
import * as style from './style.scss'

interface IPlayState {
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {
    lang = Lang.extractLang({
        hello: ['Hello', '你好']
    })

    render() {
        const {lang} = this
        return <section className={style.play}>
            <Stage dev={true}>
                <g transform={`translate(${span(1)},${span(1.8)})`}>
                    <Host
                        msg={lang.hello}/>
                </g>
            </Stage>
        </section>
    }

}
