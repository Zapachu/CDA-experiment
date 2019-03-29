import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang} from 'bespoke-client-util'
import {ICreateParams, IPlayerState} from '../interface'
import {FetchType} from '../config'

interface IResultState {
}

export class Result extends Core.Result<ICreateParams, IPlayerState, FetchType, IResultState> {
    lang = Lang.extractLang({
        totalPoint: ['你在本场试验共获得积分 ', 'Total points you have got in this game are '],
        totalProfit: ['你的最终收益为 ', 'Total profit you have earned in this game is '],
    })

    state: IResultState = {}

    render(): React.ReactNode {
        const {lang, props: {game: {params: {s,participationFee}}, playerState: {finalProfit}}} = this;
        return <section className={style.result}>
            <p>{lang.totalPoint}{isNaN(finalProfit)?'-':finalProfit.toFixed(2)}</p>
            <p>{lang.totalProfit}{isNaN(finalProfit*s+participationFee)?'-':(finalProfit*s+participationFee).toFixed(2)}</p>
        </section>
    }
}
