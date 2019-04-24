import * as React from 'react'
import * as style from './style.scss'
import {Lang, BaseCreate} from '@client-vendor'
import {registerOnFramework} from '../../index'

export class Create extends BaseCreate<any> {

    state = {
        wjxUrl: '',
        isEdit: true
    }

    createPhase(namespace: string) {
        console.log(namespace)
        const {props: {updatePhase}} = this
        updatePhase([], {namespace})
    }

    inputWjxUrl = (event) => {
        let value = event.target.value
        this.setState({wjxUrl: event.target.value}, () => {
            if (value.includes('.aspx') && value.includes('wjx') && value.includes('jq')) {
                this.submitWjxUrl(value.replace(".cn", ".com").replace(".top", ".com"))
            }
        })
    }

    submitWjxUrl = (url) => {
        console.log(url)
        const {props: {updatePhase, curPhase}} = this
        this.setState({isEdit: false})
        updatePhase(curPhase.suffixPhaseKeys, {wjxUrl: url})
    }

    toEdit = () => this.setState({isEdit: true})

    render(): React.ReactNode {
        const {props: {phases, updatePhase, curPhase}} = this

        const lang = Lang.extractLang({
            name: ['结束后跳转至', 'Link To Next Phase'],
            submit: ['保存', 'Save']
        })

        return <section className={style.create}>

            <div className={style.inputUrl}>
                <div className={style.inputTip}>输入问卷星链接</div>
                {
                    this.state.isEdit ?
                        <input value={this.state.wjxUrl} onChange={this.inputWjxUrl}/> :
                        <a onClick={this.toEdit}>{this.state.wjxUrl}</a>
                }
                {/*<button onClick={this.submitWjxUrl}>提交</button>*/}
            </div>

            <div className={style.case}>
                <label>{lang.name}</label>
                <ul className={style.suffixPhases}>
                    {
                        phases.map(({key, label}) =>
                            <li key={key}
                                className={`${key === curPhase.param.nextPhaseKey ? style.active : ''}`}
                                onClick={() => updatePhase([key], {nextPhaseKey: key})}>
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
