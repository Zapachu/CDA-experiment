import * as React from 'react'
import * as style from './style.scss'
import {Lang, BaseCreate, registerOnFramework} from '@core/client'

class Create extends BaseCreate<any> {

    state = {
        wjxUrl: '',
        isEdit: true
    }

    /**
     * 新建 phase
     * @param namespace
     */
    createPhase(namespace: string) {
        console.log(namespace)
        const {props: {updatePhase}} = this
        updatePhase([], {namespace})
    }

    // 问卷地址
    handleInputwjxUrl = (event) => {
        this.setState({wjxUrl: event.target.value})
    }

    // 提交url
    hanldeSubmitwjxUrl = () => {
        console.log(this.state.wjxUrl)
        const {props: {updatePhase}} = this
        this.setState({isEdit: false})
        updatePhase([], {wjxUrl: this.state.wjxUrl})
    }

    calcSuffixPhaseKeys(newParam) {
        return Array.from(new Set([newParam.nextPhaseKey].filter(k => k)))
    }

    // 编辑链接
    toEdit = () => {
        this.setState({isEdit: true})
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
        const {props: {phases, updatePhase, highlightPhases, curPhase}} = this
        const nextPhase = phases[phases.findIndex(({key}) => key === curPhase.key) + 1]
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
                <div className={style.inputTip}>输入问卷星链接</div>
                {
                    this.state.isEdit ?
                        <input onChange={this.handleInputwjxUrl}/> :
                        <a onClick={this.toEdit}>{this.state.wjxUrl}</a>
                }
                <button onClick={this.hanldeSubmitwjxUrl}>提交</button>
            </div>

            <div className={style.case}>
                <label>{lang.name}</label>
                <ul className={style.suffixPhases}>
                    {
                        phases.map(({key, label}) => <li key={key}
                                                         className={`${key === curPhase.param.nextPhaseKey ? style.active : ''}`}
                                                         onMouseEnter={() => highlightPhases([key])}
                                                         onMouseOut={() => highlightPhases([])}
                                                         onClick={() => updatePhase(this.calcSuffixPhaseKeys({
                                                             ...curPhase.param, nextPhaseKey: key
                                                         }), {nextPhaseKey: key})}>
                                {label || key}
                            </li>
                        )
                    }
                </ul>
            </div>
        </section>
    }
}

registerOnFramework('wjx', {
    localeNames: ['问卷星', 'WJX Phase'],
    Create
})