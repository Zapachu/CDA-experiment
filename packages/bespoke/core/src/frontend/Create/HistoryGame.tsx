import * as React from 'react'
import * as style from './style.scss'
import * as dateFormat from 'dateformat'
import {baseEnum, IGameConfig, IGameThumb} from '@bespoke/share'
import {Lang} from 'elf-component'
import {Api} from '../util'

declare interface IHistoryGameProps {
    applyHistoryGame: (gameCfg: IGameConfig<any>) => void,
}

declare interface IHistoryGameState {
    historyGameThumbs: Array<IGameThumb>
}

export class HistoryGame extends React.Component<IHistoryGameProps, IHistoryGameState> {
    state: IHistoryGameState = {
        historyGameThumbs: []
    }
    lang = Lang.extractLang({
        LoadFromHistory: ['点击加载历史实验配置', 'click to load configuration from history game']
    })

    async componentDidMount() {
        const {code, historyGameThumbs} = await Api.getHistoryGames()
        if (code === baseEnum.ResponseCode.success) {
            this.setState({historyGameThumbs})
        }
    }

    async chooseHistoryGame(gameId) {
        const {code, game} = await Api.getGame(gameId)
        if (code === baseEnum.ResponseCode.success) {
            this.props.applyHistoryGame(game)
        }
    }

    render() {
        const {lang, state: {historyGameThumbs}} = this
        return <section className={style.loadFromHistory}>
            <span className={style.tips}>{lang.LoadFromHistory}</span>
            <ul className={style.historyGameThumbs}>
                {historyGameThumbs.map(({id, title, createAt}) =>
                    <li key={id} onClick={() => this.chooseHistoryGame(id)}>
                        <span>{title}</span>
                        <span>{dateFormat(createAt, 'yyyy-mm-dd')}</span>
                    </li>
                )}
            </ul>
        </section>
    }
}