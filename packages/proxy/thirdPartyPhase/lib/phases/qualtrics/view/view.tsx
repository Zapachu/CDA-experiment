import * as React from 'react'
import {BaseCreate, Lang} from '@client-vendor'
import * as style from './style.scss'

import {registerOnFramework} from '../../index'

export class Create extends BaseCreate<any> {

    state = {
        qualtricsUrl: '',
        isEdit: true
    }

    handleInputQualtricsUrl = (event) => {
        this.setState({qualtricsUrl: event.target.value})
    }

    hanldeSubmitQualtricsUrl = () => {
        console.log(this.state.qualtricsUrl)
        const {props: {updatePhase}} = this
        this.setState({isEdit: false})
        updatePhase([], {qualtricsUrl: this.state.qualtricsUrl})
    }

    calcSuffixPhaseKeys(newParam) {
        return Array.from(new Set([newParam.nextPhaseKey].filter(k => k)))
    }

    toEdit = () => {
        this.setState({isEdit: true})
    }

    render(): React.ReactNode {
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
                <div className={style.inputTip}>输入qualtrics匿名链接</div>
                {
                    this.state.isEdit ?
                        <input onChange={this.handleInputQualtricsUrl}/> :
                        <a onClick={this.toEdit}>{this.state.qualtricsUrl}</a>
                }
                <button onClick={this.hanldeSubmitQualtricsUrl}>提交</button>
            </div>

            <div className={style.case}>
                <label>{lang.name}</label>
                <ul className={style.suffixPhases}>
                    {
                        phases.map(({key, label}) =>
                            <li key={key}
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

registerOnFramework('qualtrics', {
    localeNames: ['Qualtrics 环节', 'Qualtrics Phase'],
    Create,
    type: 'survey'
})

