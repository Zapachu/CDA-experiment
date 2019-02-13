import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, MaskLoading} from '@dev/client'
import {ICreateParams, IPlayerState} from '../interface'
import {FetchType} from '../config'
import {loadImgGroup, TImgGroup} from './util/imgGroup'

interface IResultState {
    imageGroup?: TImgGroup
}

export class Result extends Core.Result<ICreateParams, IPlayerState, FetchType, IResultState> {
    lang = Lang.extractLang({
        round: ['轮次', 'Round'],
        profit: ['利润', 'Profit']
    })

    state: IResultState = {}

    async componentDidMount() {
        this.setState({imageGroup: await loadImgGroup()})
    }

    render(): React.ReactNode {
        const {lang, props: {playerState: {profits}}, state: {imageGroup}} = this
        if (!imageGroup) {
            return <MaskLoading/>
        }
        const {background} = imageGroup
        return <section className={style.result} style={{
            background: `url(${background.src}) no-repeat`,
            height: background.height,
            width: background.width
        }}>
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
