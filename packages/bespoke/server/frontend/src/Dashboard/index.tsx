import * as React from 'react'
import * as style from './style.scss'
import {IGameThumb} from 'bespoke-common'
import {RouteComponentProps} from 'react-router-dom'
import {Api, Lang} from 'bespoke-client'
import * as dateFormat from 'dateformat'

declare interface IDashboardState {
    namespaces: Array<string>
    historyGameThumbs: Array<IGameThumb>
}

export class Dashboard extends React.Component<RouteComponentProps<{}>, IDashboardState> {
    state: IDashboardState = {
        namespaces: [],
        historyGameThumbs: []
    }

    lang = Lang.extractLang({
        createExperiment: ['创建实验', 'Create Experiment'],
        historyExperiment: ['历史实验', 'History Experiment']
    })

    async componentDidMount() {
        const {namespaces} = await Api.getAccessibleTemplates(),
            {historyGameThumbs} = await Api.getHistoryGames()
        this.setState({
            namespaces,
            historyGameThumbs
        })
    }

    render(): React.ReactNode {
        const {lang, props: {history}, state: {namespaces, historyGameThumbs}} = this
        return <section className={style.dashboard}>
            <label className={style.title}>{lang.createExperiment}</label>
            <ul className={style.namespaces}>
                {
                    namespaces.map(namespace =>
                        <li key={namespace}
                            onClick={() => history.push(`/${namespace}/create`)}
                        >{namespace}</li>
                    )
                }
            </ul>
            <label className={style.title}>{lang.historyExperiment}</label>
            <ul className={style.historyGames}>
                {
                    historyGameThumbs.map(({id, namespace, title, createAt}) =>
                        <li key={id}
                            onClick={()=>history.push(`/${namespace}/play/${id}`)}
                        >
                            {title}
                            <span className={style.timestamp}>{dateFormat(createAt, 'yyyy-mm-dd')}</span>
                        </li>)
                }
            </ul>
        </section>
    }
}