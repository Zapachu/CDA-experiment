import * as React from 'react'
import { Actor, config, IActor, IGameState, IGameWithId, IUserWithId, SocketEvent, TSocket } from 'linker-share'
import { Api, toV5, TPageProps } from '../util'
import { Lang, MaskLoading } from '@elf/component'
import { connect } from 'socket.io-client'
import * as queryString from 'query-string'
import * as style from './style.scss'
import { Button, Dropdown, Menu } from 'antd'
import { RouteComponentProps } from 'react-router'

declare interface IPlayState {
  game?: IGameWithId
  actor?: IActor
  socketClient?: TSocket
  gameState?: IGameState
}

export class Play extends React.Component<TPageProps & RouteComponentProps<{ gameId: string }>, IPlayState> {
  state: IPlayState = {}

  async componentDidMount() {
    const {
        props: {
          match: {
            params: { gameId }
          },
          location: { search },
          user
        }
      } = this,
      { token = '' } = queryString.parse(search)
    const { game } = await Api.getGame(gameId),
      { actor } = await Api.getActor(gameId, token as string)
    if (!actor) {
      this.props.history.push('/join')
    }
    document.title = game.title
    const socketClient = connect('/', {
      path: config.socketPath,
      query: `gameId=${gameId}&userId=${user.id}&token=${actor.token}&type=${actor.type}&playerId=${actor.playerId}`
    })
    this.registerStateReducer(socketClient)
    this.setState(
      {
        game,
        actor,
        socketClient
      },
      () => socketClient.emit(SocketEvent.joinRoom)
    )
  }

  render(): React.ReactNode {
    const {
      props: { user },
      state: { game, actor, gameState }
    } = this
    if (!gameState) {
      return <MaskLoading />
    }
    if (actor.type === Actor.owner) {
      return <Play4Owner {...{ gameState, game, user }} />
    }
    return <iframe className={style.playIframe} src={`${gameState.playUrl}?${Lang.key}=${Lang.activeLanguage}`} />
  }

  private registerStateReducer(socketClient: TSocket) {
    socketClient.on(SocketEvent.syncGameState, (gameState: IGameState) => {
      this.setState({ gameState: gameState })
    })
  }
}

class Play4Owner extends React.Component<{
  user: IUserWithId
  game: IGameWithId
  gameState: IGameState
}> {
  lang = Lang.extractLang({
    gameInfo: ['实验信息', 'Game Info'],
    console: ['控制台', 'Console'],
    playerStatus: ['玩家状态', 'Player Status'],
    point: ['得分', 'Point'],
    uniKey: ['唯一标识', 'UniKey'],
    detail: ['详情', 'Detail'],
    reward: ['奖励', 'Reward']
  })

  render(): React.ReactNode {
    const {
      props: { user, game, gameState },
      lang
    } = this
    return (
      <section>
        <div style={{ position: 'absolute', right: 8, top: 48, zIndex: 1000 }}>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item>
                  <Button onClick={() => toV5(config.academus.route.home(user.orgCode, game.id))}>
                    {lang.gameInfo}
                  </Button>
                </Menu.Item>
              </Menu>
            }
          >
            <Button type="primary" shape="circle" icon="bars" />
          </Dropdown>
        </div>
        {gameState.playUrl.includes('ancademy') ? (
          <iframe className={style.playIframe} src={`${gameState.playUrl}?${Lang.key}=${Lang.activeLanguage}`} />
        ) : (
          <div className={style.consoleBtnWrapper}>
            <Button type="primary" onClick={() => window.open(gameState.playUrl)}>
              {lang.playerStatus}
            </Button>
          </div>
        )}
      </section>
    )
  }
}
