import * as React from 'react'
import { BaseCreate, BasePlay, Lang } from '@core/client'
import * as style from './style.scss'

import { PushType, MoveType } from './config'
import {registerOnFramework} from '../index'

class Create extends BaseCreate<any> {

    state = {
        qqwjUrl: '',
        isEdit: true
    }

    /**
     * 新建 phase
     * @param namespace 
     */
    createPhase(namespace: string) {
        console.log(namespace)
        const { props: { updatePhase } } = this
        updatePhase([], { namespace })
    }

    // 问卷地址
    handleInputUrl = (event) => {
        this.setState({ qqwjUrl: event.target.value })
    }

    // 提交url
    hanldeSubmitUrl = () => {
        console.log(this.state.qqwjUrl)
        const { props: { updatePhase } } = this
        this.setState({ isEdit: false })
        updatePhase([], { qqwjUrl: this.state.qqwjUrl })
    }

    calcSuffixPhaseKeys(newParam) {
        return Array.from(new Set([newParam.nextPhaseKey].filter(k => k)))
    }

    // 编辑链接
    toEdit = () => {
        this.setState({ isEdit: true })
    }

    /**
     * 新建视图
     */
    render(): React.ReactNode {

        /**
         * language: 语言
         * phases: 所有已创建phases
         * updatePhase: 创建一个新的phase
         * highlightPhase: 高亮phase
         * nextPhaseKey: 下一个phase
         */
        const { props: { phases, updatePhase, highlightPhases, curPhase } } = this
        const nextPhase = phases[phases.findIndex(({ key }) => key === curPhase.key) + 1]
        console.log(curPhase)
        console.log(phases)

        const lang = Lang.extractLang({
            name: ['结束后跳转至', 'Link To Next Phase'],
            submit: ['保存', 'Save']
        })

        if (nextPhase && !curPhase.param.nextPhaseKey) {
            setTimeout(() => updatePhase([nextPhase.key], {
                nextPhaseKey: nextPhase.key
            }), 0)
        }

        return <section className={style.create}>

            <div className={style.inputUrl}>
                <div className={style.inputTip}>输入腾讯问卷链接</div>
                {
                    this.state.isEdit ?
                        <input onChange={this.handleInputUrl} /> :
                        <a onClick={this.toEdit}>{this.state.qqwjUrl}</a>
                }
                <button onClick={this.hanldeSubmitUrl}>提交</button>
            </div>

            <div className={style.case}>
                <label>{lang.name}</label>
                <ul className={style.suffixPhases}>
                    {
                        phases.map(({ key, label }) => <li key={key}
                            className={`${key === curPhase.param.nextPhaseKey ? style.active : ''}`}
                            onMouseEnter={() => highlightPhases([key])}
                            onMouseOut={() => highlightPhases([])}
                            onClick={() => updatePhase(this.calcSuffixPhaseKeys({
                                ...curPhase.param, nextPhaseKey: key
                            }), { nextPhaseKey: key })}>
                            {label || key}
                        </li>
                        )
                    }
                </ul>
            </div>
        </section>
    }
}

class Play extends BasePlay<MoveType, PushType> {

    render(): React.ReactNode {
        return <section></section>
    }
}

registerOnFramework('qqwj',{
    localeNames:['腾讯问卷', 'Tencent Survey'],
    Create,
    Play
})

