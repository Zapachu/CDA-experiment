import * as React from 'react'
import * as style from './style.scss'
import {baseEnum} from '@common'
import {RouteComponentProps} from 'react-router-dom'
import {Api, Lang} from '@client-util'
import {message} from '@antd-component'
import {CodePanel} from '@client-component'

export class Join extends React.Component<RouteComponentProps<{}>> {
    lang = Lang.extractLang({
        notFound: ['未找到对应实验', 'Experiment not Found'],
        tips: ['输入6位数字快速加入实验', 'Input a 6-digit number to join an experiment']
    })

    componentDidMount(): void {
        location.reload()
    }

    async joinGame(code: string) {
        const {lang, props: {history}} = this
        const res = await Api.joinGameWithCode(code)
        switch (res.code) {
            case baseEnum.ResponseCode.success: {
                history.push(`/info/${res.gameId}`)
                break
            }
            default: {
                message.error(lang.notFound)
            }
        }
    }

    render(): React.ReactNode {
        return null
        return <section className={style.Join}>
            <div className={style.tips}>{this.lang.tips}</div>
            <CodePanel number={6}
                       onFinish={code => this.joinGame(code)}
                       goBack={() => this.props.history.goBack()}
            />
        </section>
    }
}
