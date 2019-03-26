import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang} from 'bespoke-client-util'
import {ICreateParams, IPlayerState} from '../interface'
import {FetchType} from '../config'

interface IResultState {
}

export class Result extends Core.Result<ICreateParams, IPlayerState, FetchType, IResultState> {
    lang = Lang.extractLang({
        end: ['实验结束, 谢谢参与!', 'Game over, thanks for participating!']
    })

    state: IResultState = {}

    render(): React.ReactNode {
        const {lang} = this;
        return <section className={style.result} style={{
        }}>
            <p>{lang.end}</p>
        </section>
    }
}
