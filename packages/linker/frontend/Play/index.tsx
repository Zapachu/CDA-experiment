import * as React from 'react'
import { Actor, IActor, IGameWithId, IUserWithId } from 'linker-share'
import { Api, Frame, toV5, TPageProps, V5Route } from '../util'
import { Lang, MaskLoading } from '@elf/component'
import * as queryString from 'query-string'
import * as style from './style.scss'
import { Button, Col, Icon, PageHeader, Row, Tabs, Tooltip, Typography } from 'antd'
import { RouteComponentProps } from 'react-router'
import dateFormat = require('dateformat')

const { TabPane } = Tabs

export function Play({ user, ...routeProps }: TPageProps & RouteComponentProps<{ gameId: string }>) {
  const [game, setGame] = React.useState(null as IGameWithId),
    [actor, setActor] = React.useState(null as IActor)
  React.useEffect(() => {
    const {
        match: {
          params: { gameId }
        },
        location: { search }
      } = routeProps,
      { token = '' } = queryString.parse(search)
    Promise.all([Api.getGame(gameId), Api.getActor(gameId, token as string)]).then(([{ game }, { actor }]) => {
      console.log(game, actor)
      if (!actor) {
        this.props.history.push('/join')
        return
      }
      document.title = game.title
      setGame(game)
      setActor(actor)
    })
  }, [])
  if (!game || !actor) {
    return <MaskLoading />
  }
  if (actor.type === Actor.owner) {
    return <Play4Owner {...{ game, user, ...routeProps }} />
  }
  return <iframe className={style.playIframe} src={`${game.playUrl}?${Lang.key}=${Lang.activeLanguage}`} />
}

enum HeadTab {
  console = 'console',
  member = 'member',
  transaction = 'transaction'
}

function Play4Owner({
  user,
  game,
  history
}: RouteComponentProps<{ gameId: string }> & {
  user: IUserWithId
  game: IGameWithId
}) {
  const lang = Lang.extractLang({
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
  return (
    <Frame user={user}>
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
        <Tabs
          style={{ marginBottom: '-2rem' }}
          activeKey={HeadTab.console}
          onChange={(tab: HeadTab) => {
            switch (tab) {
              case HeadTab.member:
                toV5(V5Route.member, user.orgCode, game.id)
                break
              case HeadTab.transaction:
                toV5(V5Route.transaction, user.orgCode, game.id)
                break
            }
          }}
        >
          <TabPane tab={lang.console} key={HeadTab.console} />
          <TabPane tab={lang.member} key={HeadTab.member} />
          <TabPane tab={lang.transaction} key={HeadTab.transaction} />
        </Tabs>
      </PageHeader>
      {game.playUrl.includes('bespoke') ? (
        <iframe className={style.ownerPlayIframe} src={`${game.playUrl}?${Lang.key}=${Lang.activeLanguage}`} />
      ) : (
        <div className={style.consoleBtnWrapper}>
          <Button type="primary" onClick={() => window.open(game.playUrl)}>
            {lang.playerStatus}
          </Button>
        </div>
      )}
    </Frame>
  )
}
