import * as React from 'react'
import * as style from './style.scss'
import { Api, Frame, GameTemplate, TPageProps } from '../util'
import { Lang, loadScript } from '@elf/component'
import { IGameConfig, ResponseCode } from '@elf/share'
import { RouteComponentProps } from 'react-router'
import * as ReactMarkdown from 'react-markdown'
import { Button, Card, Form, Icon, Input, List, message, Modal, PageHeader, Skeleton, Tooltip } from 'antd'
import * as dateFormat from 'dateformat'

export function Create({
  user,
  history,
  match: {
    params: { namespace }
  }
}: TPageProps & RouteComponentProps<{ namespace: string; gameId: string }>) {
  const lang = Lang.extractLang({
    title: ['实验标题', 'Game Title'],
    desc: ['描述', 'Description'],
    invalidBaseInfo: ['请检查实验标题与描述信息', 'Check game title and description please'],
    start: ['开始', 'Start'],
    end: ['结束', 'End'],
    submit: ['提交', 'SUBMIT'],
    submitFailed: ['提交失败', 'Submit failed'],
    createSuccess: ['创建成功', 'Created successfully'],
    historyGame: ['载入历史配置', 'Load from History'],
    loadFromHistory: ['点击从历史实验加载实验配置', 'Click to load configuration from history game'],
    loadSuccess: ['加载成功', 'Load success'],
    createGame: ['创建实验', 'CreateGame'],
    baseInfo: ['基本信息', 'Base Info'],
    detailCfg: ['详细配置', 'Detail Configuration'],
    reset: ['恢复默认', 'Reset'],
    lastStep: ['上一步', 'Last Step'],
    game: ['实验', 'Game'],
    preview: ['预览', 'Preview']
  })
  const CardStyle: React.CSSProperties = { margin: '1.5rem' }
  const [loading, setLoading] = React.useState(true),
    [submitable, setSubmitable] = React.useState(true),
    [title, setTitle] = React.useState(''),
    [desc, setDesc] = React.useState(''),
    [previewDesc, setPreviewDesc] = React.useState(false),
    [params, setParams] = React.useState({})
  React.useEffect(() => {
    Api.getJsUrl(namespace).then(({ code, jsUrl }) => {
      if (code !== ResponseCode.success) {
        return
      }
      loadScript(jsUrl.split(';'), () => setLoading(false))
    })
  }, [])

  async function handleSubmit() {
    if (!title || !desc) {
      return message.warn(lang.invalidBaseInfo)
    }
    const { code, gameId } = await Api.postNewGame(title, desc, namespace, params)
    if (code === ResponseCode.success) {
      message.success(lang.createSuccess)
      history.push(`/play/${gameId}`)
    } else {
      message.error(lang.submitFailed)
    }
  }

  function updatePhase(action) {
    if (typeof action === 'function') {
      setParams(params => ({ ...params, ...action(params) }))
    } else {
      setParams({ ...params, ...action })
    }
  }

  if (loading) {
    return <Skeleton />
  }
  const { Create } = GameTemplate.getTemplate()
  return (
    <Frame user={user}>
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
              breadcrumbName: lang.createGame
            }
          ]
        }}
      />
      <div className={style.content}>
        <Card title={lang.baseInfo} style={CardStyle}>
          <Form.Item required={true} label={lang.title} labelCol={{ md: 2 }} wrapperCol={{ md: 10 }}>
            <Input
              autoFocus
              value={title}
              maxLength={20}
              onChange={({ target: { value: title } }) => setTitle(title)}
            />
          </Form.Item>
          <Form.Item
            required={true}
            label={
              <span>
                {lang.desc}&nbsp;
                <Tooltip title={lang.preview}>
                  <Icon type={previewDesc ? 'eye' : 'eye-invisible'} onClick={() => setPreviewDesc(!previewDesc)} />
                </Tooltip>
              </span>
            }
            labelCol={{ md: 2 }}
            wrapperCol={{ md: 10 }}
          >
            {previewDesc ? (
              <div className={style.descPreviewWrapper} onClick={() => setPreviewDesc(false)}>
                <ReactMarkdown source={desc} />
              </div>
            ) : (
              <Input.TextArea
                onBlur={() => setPreviewDesc(true)}
                value={desc}
                maxLength={500}
                autosize={{ minRows: 4, maxRows: 8 }}
                onChange={({ target: { value: desc } }) => setDesc(desc)}
              />
            )}
          </Form.Item>
        </Card>
        <Card title={lang.detailCfg} style={CardStyle}>
          <Create
            {...{
              submitable,
              setSubmitable: submitable => setSubmitable(submitable),
              params,
              setParams: action => updatePhase(action)
            }}
          />
        </Card>
      </div>
      <div className={style.submitBar}>
        <Button
          onClick={() => {
            const modal = Modal.info({
              width: '48rem',
              title: lang.loadFromHistory,
              content: (
                <div style={{ marginTop: '1rem' }}>
                  <HistoryGame
                    {...{
                      namespace: namespace,
                      applyHistoryGame: ({ title, desc, params }: IGameConfig<any>) => {
                        setTitle(title)
                        setDesc(desc)
                        setParams(params)
                        modal.destroy()
                        message.success(lang.loadSuccess)
                      }
                    }}
                  />
                </div>
              )
            })
          }}
        >
          {lang.historyGame}
        </Button>
        &nbsp;&nbsp;&nbsp;
        <a onClick={() => location.reload()}>{lang.reset}</a>
        <span style={{ flexGrow: 1 }} />
        <Button onClick={() => history.goBack()}>{lang.lastStep}</Button>
        &nbsp;&nbsp;&nbsp;
        <Button disabled={!submitable} type="primary" onClick={() => handleSubmit()}>
          {lang.submit}
        </Button>
      </div>
    </Frame>
  )
}

function HistoryGame({
  applyHistoryGame,
  namespace
}: {
  namespace: string
  applyHistoryGame: (gameCfg: IGameConfig<any>) => void
}) {
  const [historyGameThumbs, setHistoryGameThumbs] = React.useState([])
  React.useEffect(() => {
    Api.getHistoryGames(namespace).then(({ historyGameThumbs }) => setHistoryGameThumbs(historyGameThumbs))
  }, [])
  return (
    <List
      dataSource={historyGameThumbs}
      grid={{
        gutter: 16,
        md: 2
      }}
      renderItem={({ id, title, createAt }) => (
        <List.Item>
          <div
            style={{ cursor: 'pointer' }}
            onClick={async () => {
              const { code, game } = await Api.getGame(id)
              if (code === ResponseCode.success) {
                applyHistoryGame(game)
              }
            }}
          >
            <List.Item.Meta title={title} description={dateFormat(createAt, 'yyyy-mm-dd')} />
          </div>
        </List.Item>
      )}
    />
  )
}
