import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang} from 'bespoke-client-util'
import {ICreateParams, IPlayerState} from '../interface'
import {FetchType} from '../config'

interface IResultState {
}

export class Result extends Core.Result<ICreateParams, IPlayerState, FetchType, IResultState> {
    lang = Lang.extractLang({
        round: ['轮次', 'Round'],
        profit: ['利润', 'Profit']
    })

    state: IResultState = {}

    render(): React.ReactNode {
        return <section className={style.result} style={{
        }}>
            <p>实验结束, 谢谢参与!</p>
        </section>
    }
}
