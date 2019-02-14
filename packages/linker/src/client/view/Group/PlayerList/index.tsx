import * as React from 'react'
import * as style from './style.scss'
import {Api, Lang} from '@client-util'
import {RouteComponentProps} from 'react-router'
import {TApiGroupPlayers} from '@common'
import {List} from '@antd-component'
import {Title, Breadcrumb} from '@client-component'

interface IPlayerListState {
    players: TApiGroupPlayers
}

export class PlayerList extends React.Component<RouteComponentProps<{ groupId: string }>, IPlayerListState> {
    lang = Lang.extractLang({
        console:['控制台','Console'],
        groupPlayers: ['实验组成员', 'Group Players']
    })

    state: IPlayerListState = {
        players: []
    }

    async componentDidMount() {
        const {players} = await Api.getPlayers(this.props.match.params.groupId)
        this.setState({
            players
        })
    }

    render(): React.ReactNode {
        const {lang, props:{history, match:{params:{groupId}}}} = this
        return <section className={style.playerList}>
            <Breadcrumb history={history} links={[
                {label: lang.console, to: `/group/play/${groupId}`},
            ]}/>
            <Title label={this.lang.groupPlayers}/>
            <List size={'large'}
                  dataSource={this.state.players}
                  renderItem={item => <List.Item>{item.name}</List.Item>}/>
        </section>
    }
}