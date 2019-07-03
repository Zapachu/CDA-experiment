import * as React from 'react'
import * as style from './style.scss'
import {Core} from '@bespoke/client-sdk'
import {ICreateParams, IGameState, IPlayerState} from '../interface'

export class Result extends Core.Result<ICreateParams, IGameState, IPlayerState> {
    render(): React.ReactNode {
        const {props: {playerState: {profits}}} = this
        return <div className={style.result}>
            <table className={style.resultTable}>
                <tbody>
                <tr>
                    <td>轮次</td>
                    <td>收益</td>
                </tr>
                {
                    profits.map((n, i) => <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{n}</td>
                    </tr>)
                }
                </tbody>
            </table>
        </div>
    }
}
