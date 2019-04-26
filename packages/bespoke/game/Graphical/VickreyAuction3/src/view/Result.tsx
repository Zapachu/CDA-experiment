import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang} from 'bespoke-client-util'
import {ICreateParams, IGameState, IPlayerState} from '../interface'
import {FetchType} from '../config'

export class Result extends Core.Result<ICreateParams, IGameState, IPlayerState, FetchType> {
    lang = Lang.extractLang({
        round: ['轮次', 'Round'],
        profit: ['利润', 'Profit']
    })

    render(): React.ReactNode {
        const {lang, props: {playerState: {profits}}} = this
        return <section className={style.result}>
            <table className={style.resultTable}>
                <tbody>
                <tr>
                    <td>{lang.round}</td>
                    <td>{lang.profit}</td>
                </tr>
                {
                    profits.map((n, i) => <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{n}</td>
                    </tr>)
                }
                </tbody>
            </table>
        </section>
    }
}
