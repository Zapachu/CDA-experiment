import * as React from 'react'
import * as style from './style.scss'
import { Api, GameTemplate, TPageProps } from '../util'
import { Lang, loadScript } from '@elf/component'
import { RouteComponentProps } from 'react-router'
import { Button, Card, Form, Input, PageHeader, Skeleton } from 'antd'
import { IGameWithId } from 'linker-share'

export function View({
  history,
  match: {
    params: { gameId }
  }
}: TPageProps & RouteComponentProps<{ gameId: string }>) {
  const lang = Lang.extractLang({
    title: ['实验标题', 'Game Title'],
    desc: ['实验描述', 'Description'],
    viewGame: ['查看实验', 'ViewGame'],
    baseInfo: ['基本信息', 'Base Info'],
    detailCfg: ['详细配置', 'Detail Configuration'],
    game: ['实验', 'Game'],
    goBack: ['返回', 'Go Back']
  })
  const CardStyle: React.CSSProperties = { margin: '1.5rem' }
  const [loading, setLoading] = React.useState(true),
    [game, setGame] = React.useState(null as IGameWithId)
  React.useEffect(() => {
    Api.getGame(gameId).then(({ game }) => {
      setGame(game)
      Api.getJsUrl(game.namespace).then(({ jsUrl }) => {
        loadScript(jsUrl.split(';'), () => setLoading(false))
      })
    })
  }, [])

  if (loading) {
    return <Skeleton />
  }
  const { Create } = GameTemplate.getTemplate()
  return (
    <>
      <PageHeader
        title={null}
        breadcrumb={{
          routes: [
            {
              path: '#',
              breadcrumbName: lang.game
            },
            {
              path: '#',
              breadcrumbName: lang.viewGame
            }
          ]
        }}
      />
      <div className={style.content}>
        <Card title={lang.baseInfo} style={CardStyle}>
          <Form.Item required={true} label={lang.title} labelCol={{ md: 2 }} wrapperCol={{ md: 10 }}>
            <Input value={game.title} disabled={true} />
          </Form.Item>
          <Form.Item required={true} label={lang.desc} labelCol={{ md: 2 }} wrapperCol={{ md: 10 }}>
            <Input.TextArea value={game.desc} disabled={true} />
          </Form.Item>
        </Card>
        <Card title={lang.detailCfg} style={CardStyle}>
          <Create
            {...{
              submitable: false,
              params: game.params,
              setParams: action => null
            }}
          />
        </Card>
      </div>
      <div className={style.submitBar}>
        <span style={{ flexGrow: 1 }} />
        <Button onClick={() => history.goBack()}>{lang.goBack}</Button>
      </div>
    </>
  )
}
