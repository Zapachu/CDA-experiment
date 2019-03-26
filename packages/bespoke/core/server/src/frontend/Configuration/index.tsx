import * as React from 'react'
import * as style from './style.scss'

import {IGameWithId} from 'bespoke-common'
import {Api, Lang, MaskLoading, Button, ButtonProps} from 'bespoke-client-util'
import {connCtx, rootContext, TRootCtx} from '../context'
import {RouteComponentProps} from 'react-router'

declare type IConfigurationState = {
    loading: boolean,
    game?: IGameWithId<any>
}

@connCtx(rootContext)
export class Configuration extends React.Component<TRootCtx & RouteComponentProps<{ gameId: string }>, IConfigurationState> {
    lang = Lang.extractLang({
        playRoom: ['返回游戏', 'BACK TO GAME']
    })
    state: IConfigurationState = {
        loading: true
    }

    async componentDidMount() {
        const {props: {match: {params: {gameId}}}} = this
        const {game} = await Api.getGame(gameId)
        this.setState({
            loading: false,
            game
        })
    }

    render() {
        const {lang, props: {history, match: {params: {gameId}}, gameTemplate}, state: {loading, game}} = this
        if (loading) {
            return <MaskLoading/>
        }
        const {Info} = gameTemplate
        return <section className={style.configuration}>
            <div className={style.gameInfo}>
                <p>{game.desc}</p>
            </div>
            <ul className={style.phaseList}>
                <Info {...{game}}/>
                <li style={{margin: '2rem auto 0'}}>
                    <Button width={ButtonProps.Width.medium}
                            color={ButtonProps.Color.blue}
                            label={lang.playRoom}
                            onClick={() => history.push(`/${game.namespace}/play/${gameId}`)}
                    />
                </li>
            </ul>
        </section>
    }
}