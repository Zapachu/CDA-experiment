import * as React from 'react'
import * as style from './style.scss'
import { RouteComponentProps } from 'react-router-dom'
import { Api } from '../util'
import { Lang } from '@elf/component'
import { ResponseCode } from '@elf/share'
import { message } from 'antd'
import { CodePanel } from '../component'

export class Join extends React.Component<RouteComponentProps<{}>> {
  lang = Lang.extractLang({
    notFound: ['未找到对应实验', 'Experiment not Found'],
    tips: ['输入6位数字快速加入实验', 'Input a 6-digit number to join an experiment']
  })

  async joinGame(code: string) {
    const {
      lang,
      props: { history }
    } = this
    const res = await Api.joinGameWithCode(code)
    switch (res.code) {
      case ResponseCode.success: {
        history.push(`/info/${res.gameId}`)
        break
      }
      default: {
        message.error(lang.notFound)
      }
    }
  }

  render(): React.ReactNode {
    return (
      <section className={style.Join}>
        <div className={style.tips}>{this.lang.tips}</div>
        <CodePanel number={6} onFinish={code => this.joinGame(code)} goBack={() => this.props.history.goBack()} />
      </section>
    )
  }
}
