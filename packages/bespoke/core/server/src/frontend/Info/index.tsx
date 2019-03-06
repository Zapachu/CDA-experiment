import * as React from 'react'
import * as style from './style.scss'

import {IActor, IGameWithId, baseEnum} from 'bespoke-common'
import {Api, Lang, Markdown, MaskLoading} from 'bespoke-client-util'
import {RouteComponentProps} from 'react-router'
import * as queryString from 'query-string'

declare interface IInfoState {
    game?: IGameWithId<any>
    actor?: IActor
}

export class Info extends React.Component<RouteComponentProps<{ gameId: string }>, IInfoState> {

    state: IInfoState = {}

    lang = Lang.extractLang({
        enterRoom: ['进入实验', 'Enter Game'],
        joinGame: ['加入实验', 'Join Game']
    })

    async componentDidMount() {
        const {props: {history, match: {params: {gameId}}, location: {hash = '#', search}}} = this,
            {token = ''} = queryString.parse(search)
        const {game} = await Api.getGame(gameId),
            {actor} = await Api.getActor(gameId, hash.replace('#', ''), token as string)
        if (!token) {
            history.push(`${history.location.pathname}?${queryString.stringify({token: actor.token})}`)
        }
        this.setState({game, actor})
    }

    render() {
        const {lang, props: {history, match: {params: {gameId}}, location: {search}}, state: {game, actor}} = this
        if (!game) {
            return <MaskLoading/>
        }
        return <div className={style.info}>
            <section className={style.desc}>
                <Markdown editable={false} value={game.desc}/>
            </section>
            <ul className={style.featureButtons}>
                <li {...{
                    style: {
                        backgroundColor: '#ff888e'
                    },
                    onClick: () => history.push(`/${game.namespace}/play/${gameId}${search}`)
                }}>{actor.type === baseEnum.Actor.player ? lang.joinGame : lang.enterRoom}</li>
            </ul>
        </div>

    }
}