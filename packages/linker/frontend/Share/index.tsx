import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { config } from 'linker-share'
import { ResponseCode } from '@elf/share'
import { Api } from '../util'
import { Lang } from '@elf/component'
import { message } from 'antd'
import * as QrCode from 'qrcode.react'
import * as style from './style.scss'
import { Breadcrumb } from '../component'

declare interface IShareState {
  shareCode: string
  title: string
}

export class Share extends React.Component<RouteComponentProps<{ gameId: string }>, IShareState> {
  state: IShareState = {
    title: '',
    shareCode: ''
  }

  lang = Lang.extractLang({
    info: ['实验信息', 'Game Info'],
    console: ['控制台', 'Console'],
    shareCode: ['快速加入码', 'QuickAccessCode'],
    failed2GeneShareCode: ['生成快速加入码失败', 'Failed to Generate Quick Access Code']
  })

  async componentDidMount() {
    const { code, shareCode, title } = await Api.shareGame(this.props.match.params.gameId)
    if (code === ResponseCode.success) {
      this.setState({ shareCode, title })
    } else {
      message.warn(this.lang.failed2GeneShareCode)
    }
  }

  render(): React.ReactNode {
    const {
      lang,
      props: {
        history,
        match: {
          params: { gameId }
        }
      },
      state
    } = this
    return (
      <section className={style.share}>
        <Breadcrumb
          history={history}
          links={[
            { label: lang.info, to: `/info/${gameId}` },
            { label: lang.console, to: `/play/${gameId}` }
          ]}
        />
        <div className={style.shareContent}>
          <h2>{state.title}</h2>
          <div className={style.qrCodeWrapper} onClick={() => history.push(`/info/${gameId}`)}>
            <QrCode size={256} value={`${location.origin}/${config.rootName}/info/${gameId}`} />
          </div>
          <div className={style.shareCode}>
            <label>{lang.shareCode}</label>
            <span>{state.shareCode}</span>
          </div>
        </div>
      </section>
    )
  }
}
