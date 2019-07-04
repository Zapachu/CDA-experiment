import * as React from 'react'
import {Template} from '@elf/register'
import * as style from './style.scss'

import {registerOnFramework} from '../../index'

class Create extends Template.Create<{ qqwjUrl: string }> {
    state = {
        qqwjUrl: '',
        isEdit: true
    }

    handleInputUrl = (event) => {
        this.setState({qqwjUrl: event.target.value})
    }

    handleSubmitUrl = () => {
        const {props: {setParams}} = this
        this.setState({isEdit: false})
        setParams({qqwjUrl: this.state.qqwjUrl})
    }

    toEdit = () => {
        this.setState({isEdit: true})
    }

    render(): React.ReactNode {
        return <section className={style.create}>
            <div className={style.inputUrl}>
                <div className={style.inputTip}>输入腾讯问卷链接</div>
                {
                    this.state.isEdit ?
                        <input onChange={this.handleInputUrl}/> :
                        <a onClick={this.toEdit}>{this.state.qqwjUrl}</a>
                }
                <button onClick={this.handleSubmitUrl}>提交</button>
            </div>
        </section>
    }
}

registerOnFramework('qqwj', {
    localeNames: ['腾讯问卷', 'Tencent Survey'],
    Create
})

