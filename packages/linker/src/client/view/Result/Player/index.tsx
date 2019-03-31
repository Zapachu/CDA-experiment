import * as React from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {Api, Lang} from '@client-util'
import {baseEnum, TApiPlayerResults} from '@common'
import * as style from './style.scss'

interface IState {
    results: TApiPlayerResults
}

export class PlayerResult extends React.Component<RouteComponentProps<{ gameId: string, playerId: string }>, IState> {
    lang = Lang.extractLang({
        uniKey: ['唯一标识', 'UniKey'],
        point: ['得分', 'point']
    })
    state: IState = {
        results: []
    }

    async componentDidMount(): Promise<void> {
        const {props: {match: {params: {gameId, playerId}}}} = this
        const {code, results} = await Api.getPlayerResult(gameId, playerId)
        if (code === baseEnum.ResponseCode.success) {
            this.setState({results})
        }
    }

    render(): React.ReactNode {
        const {lang, state: {results}} = this
        return <section>
            {
                results.map(({uniKey, detailIframeUrl, point, phaseName}) =>
                    detailIframeUrl ? <iframe src={detailIframeUrl}/> :
                        <div className={style.phaseResult}>
                            <h3>{phaseName}</h3>
                            <div>
                                <label>{lang.uniKey}</label>
                                <span>{uniKey}</span>
                            </div>
                            <div>
                                <label>{lang.point}</label>
                                <span>{point}</span>
                            </div>
                        </div>)
            }
        </section>
    }
}
