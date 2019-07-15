import * as React from 'react'
import {Actor, config, IActor, IGameState, IGameWithId, SocketEvent, TSocket} from 'linker-share'
import {Api, TPageProps} from '../util'
import {Lang} from '@elf/component'
import {connect} from 'socket.io-client'
import * as queryString from 'query-string'
import {Loading} from '../component'
import * as style from './style.scss'
import {Link} from 'react-router-dom'
import {Affix, Button, Dropdown, Menu} from 'antd'

declare interface IPlayState {
    game?: IGameWithId,
    actor?: IActor,
    socketClient?: TSocket,
    gameState?: IGameState
}

export class Play extends React.Component<TPageProps, IPlayState> {
    state: IPlayState = {}

    async componentDidMount() {
        const {props: {match: {params: {gameId}}, location: {search}, user}} = this,
            {token = ''} = queryString.parse(search)
        const {game} = await Api.getGame(gameId),
            {actor} = await Api.getActor(gameId, token as string)
        if (!actor) {
            this.props.history.push('/join')
        }
        document.title = game.title
        const socketClient = connect('/', {
            path: config.socketPath,
            query: `gameId=${gameId}&userId=${user.id}&token=${actor.token}&type=${actor.type}&playerId=${actor.playerId}`
        })
        this.registerStateReducer(socketClient)
        this.setState({
            game,
            actor,
            socketClient
        }, () => socketClient.emit(SocketEvent.joinRoom))
    }

    private registerStateReducer(socketClient: TSocket) {
        socketClient.on(SocketEvent.syncGameState, (gameState: IGameState) => {
            this.setState({gameState: gameState})
        })
    }

    render(): React.ReactNode {
        const {state: {game, actor, gameState}} = this
        if (!gameState) {
            return <Loading/>
        }
        if (actor.type === Actor.owner) {
            return <Play4Owner {...{gameState, game}}/>
        }
        return <iframe className={style.playIframe}
                       src={`${gameState.playUrl}?${Lang.key}=${Lang.activeLanguage}`}/>
    }
}

class Play4Owner extends React.Component<{
    game: IGameWithId
    gameState: IGameState
}> {
    lang = Lang.extractLang({
        share: ['分享', 'Share'],
        playerList: ['玩家列表', 'PlayerList'],
        console: ['控制台', 'Console'],
        playerStatus: ['玩家状态', 'Player Status'],
        point: ['得分', 'Point'],
        uniKey: ['唯一标识', 'UniKey'],
        detail: ['详情', 'Detail'],
        reward: ['奖励', 'Reward']
    })

    render(): React.ReactNode {
        const {props: {game, gameState}, lang} = this
        return <section>
            <Affix style={{position: 'absolute', right: 32, top: 64, zIndex: 1000}}>
                <Dropdown overlay={<Menu>
                    <Menu.Item>
                        <Link to={`/player/${game.id}`}>{lang.playerList}</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to={`/share/${game.id}`}>{lang.share}</Link>
                    </Menu.Item>
                </Menu>}>
                    <Button type='primary' shape="circle" icon="bars"/>
                </Dropdown>
            </Affix>
            <iframe className={style.playIframe}
                    src={`${gameState.playUrl}?${Lang.key}=${Lang.activeLanguage}`}/>
        </section>
    }
}


