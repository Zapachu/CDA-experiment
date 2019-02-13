import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, Label} from '@dev/client'
import {ICreateParams, IMoveParams, IPlayerState} from '../interface'
import {FetchType} from '../config'

export class Result extends Core.Result<ICreateParams, IPlayerState, IMoveParams, FetchType> {
    lang = Lang.extractLang({
        profit: ['利润', 'Profit'],
        round: [n => `第${n}轮`, n => `Round ${n}`]
    })

    render(): React.ReactNode {
        const {lang, props: {playerState: {profits}}} = this
        return <section className={style.result}>
            <Label label={lang.profit}/>
            <table className={style.resultTable}>
                <tbody>
                {
                    profits.map((n, i) => <tr key={i}>
                        <td>{lang.round(i + 1)}</td>
                        <td>{n}</td>
                    </tr>)
                }
                </tbody>
            </table>
        </section>
    }
}
