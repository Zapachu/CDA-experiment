import * as React from 'react'
import * as style from './style.scss'
import {Api, Lang} from '@client-util'
import {RouteComponentProps} from 'react-router'
import {TApiPlayers} from '@common'
import {List} from '@antd-component'
import {Title, Breadcrumb} from '@client-component'

interface IPlayerListState {
    players: TApiPlayers
}

export class PlayerList extends React.Component<RouteComponentProps<{ gameId: string }>, IPlayerListState> {
    lang = Lang.extractLang({
        console:['控制台','Console'],
        players: ['成员', 'Players']
    })

    state: IPlayerListState = {
        players: []
    }

    async componentDidMount() {
        const {players} = await Api.getPlayers(this.props.match.params.gameId)
        this.setState({
            players
        })
    }

    render(): React.ReactNode {
        const {lang, props:{history, match:{params:{gameId}}}} = this
        return <section className={style.playerList}>
            <Breadcrumb history={history} links={[
                {label: lang.console, to: `/play/${gameId}`},
            ]}/>
            <Title label={this.lang.players}/>
            <List size={'large'}
                  dataSource={this.state.players}
                  renderItem={item => <List.Item>{item.name}</List.Item>}/>
        </section>
    }
}
