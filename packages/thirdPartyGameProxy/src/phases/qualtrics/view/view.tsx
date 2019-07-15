import * as React from 'react'
import {Template} from '@elf/register'
import * as style from './style.scss'

import {registerOnFramework} from '../../index'

export class Create extends Template.Create<{ qualtricsUrl: string }> {

    state = {
        qualtricsUrl: '',
        isEdit: true
    }

    handleInputQualtricsUrl = (event) => {
        this.setState({qualtricsUrl: event.target.value})
    }

    handleSubmitQualtricsUrl = () => {
        console.log(this.state.qualtricsUrl)
        const {props: {setParams}} = this
        this.setState({isEdit: false})
        setParams({qualtricsUrl: this.state.qualtricsUrl})
    }

    toEdit = () => {
        this.setState({isEdit: true})
    }

    render(): React.ReactNode {
        return <section className={style.create}>
            <div className={style.inputUrl}>
                <div className={style.inputTip}>输入qualtrics匿名链接</div>
                {
                    this.state.isEdit ?
                        <input onChange={this.handleInputQualtricsUrl}/> :
                        <a onClick={this.toEdit}>{this.state.qualtricsUrl}</a>
                }
                <button onClick={this.handleSubmitQualtricsUrl}>提交</button>
            </div>
        </section>
    }
}

registerOnFramework('qualtrics', {
    localeNames: ['Qualtrics 环节', 'Qualtrics Phase'],
    Create
})

