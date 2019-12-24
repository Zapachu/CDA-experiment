import * as React from 'react'
import { Actor, config, IActor, IGameState, IGameWithId, IUserWithId, SocketEvent, TSocket } from 'linker-share'
import { Api, toV5, TPageProps, V5Route } from '../util'
import { Lang, MaskLoading } from '@elf/component'
import { connect } from 'socket.io-client'
import * as queryString from 'query-string'
import * as style from './style.scss'
import { Button, Col, Icon, PageHeader, Row, Tabs, Tooltip, Typography } from 'antd'
import { RouteComponentProps } from 'react-router'
import dateFormat = require('dateformat')

const { TabPane } = Tabs

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
      props: { user, ...routeProps },
      state: { game, actor, gameState }
    } = this
    if (!gameState) {
      return <MaskLoading />
    }
    if (actor.type === Actor.owner) {
      return <Play4Owner {...{ gameState, game, user, ...routeProps }} />
    }
    return <iframe className={style.playIframe} src={`${gameState.playUrl}?${Lang.key}=${Lang.activeLanguage}`} />
  }

  private registerStateReducer(socketClient: TSocket) {
    socketClient.on(SocketEvent.syncGameState, (gameState: IGameState) => {
      this.setState({ gameState: gameState })
    })
  }
}

enum HeadTab {
  console = 'console',
  member = 'member',
  transaction = 'transaction'
}

class Play4Owner extends React.Component<
  RouteComponentProps<{ gameId: string }> & {
    user: IUserWithId
    game: IGameWithId
    gameState: IGameState
  }
> {
  lang = Lang.extractLang({
    game: ['实验', 'Game'],
    gameInfo: ['实验信息', 'Game Info'],
    console: ['控制台', 'Console'],
    playerStatus: ['玩家状态', 'Player Status'],
    point: ['得分', 'Point'],
    uniKey: ['唯一标识', 'UniKey'],
    detail: ['详情', 'Detail'],
    reward: ['奖励', 'Reward'],
    view: ['查看', 'View'],
    push: ['推送', 'Push'],
    share: ['分享', 'Share'],
    member: ['成员', 'Member'],
    transaction: ['流水', 'Transaction'],
    createAt: ['创建时间', 'Create At']
  })

  render(): React.ReactNode {
    const {
      props: { user, game, gameState, history },
      lang
    } = this
    return (
      <>
        <PageHeader
          breadcrumb={{
            routes: [
              {
                path: '#',
                breadcrumbName: lang.game
              },
              {
                path: '#',
                breadcrumbName: lang.console
              }
            ]
          }}
          title={<Typography.Title level={4}>{game.title}</Typography.Title>}
          subTitle={
            <Tooltip title={game.desc}>
              <Icon type="info-circle" />
            </Tooltip>
          }
          extra={[
            <Button onClick={() => history.push(`/view/${game.id}`)}>{lang.view}</Button>,
            <Button onClick={() => toV5(V5Route.push, user.orgCode, game.id)}>{lang.push}</Button>,
            <Button onClick={() => toV5(V5Route.share, user.orgCode, game.id)} type="primary">
              {lang.share}
            </Button>
          ]}
        >
          <Row>
            <Col span={12} />
            <Col span={12} style={{ textAlign: 'right' }}>{`${lang.createAt}: ${dateFormat(
              game.createAt,
              'yyyy-mm-dd'
            )}`}</Col>
          </Row>
          <Tabs style={{ marginBottom: '-2rem' }} activeKey={HeadTab.console} onChange={tab => console.log(tab)}>
            <TabPane tab={lang.console} key={HeadTab.console} />
            <TabPane tab={lang.member} key={HeadTab.member} />
            <TabPane tab={lang.transaction} key={HeadTab.transaction} />
          </Tabs>
        </PageHeader>
        {gameState.playUrl.includes('bespoke') ? (
          <iframe className={style.ownerPlayIframe} src={`${gameState.playUrl}?${Lang.key}=${Lang.activeLanguage}`} />
        ) : (
          <div className={style.consoleBtnWrapper}>
            <Button type="primary" onClick={() => window.open(gameState.playUrl)}>
              {lang.playerStatus}
            </Button>
          </div>
        )}
      </>
    )
  }
}
