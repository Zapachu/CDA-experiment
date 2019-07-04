import * as React from 'react'
import * as style from './style.scss'
import {Template} from '@elf/register'
import {registerOnFramework} from '../../index'

export class Create extends Template.Create<{ wjxUrl: string }> {

    state = {
        wjxUrl: '',
        isEdit: true
    }

    inputWjxUrl = (event) => {
        let value = event.target.value
        this.setState({wjxUrl: event.target.value}, () => {
            if (value.includes('.aspx') && value.includes('wjx') && value.includes('jq')) {
                this.submitWjxUrl(value.replace('.cn', '.com').replace('.top', '.com'))
            }
        })
    }

    submitWjxUrl = (url) => {
        const {props: {setParams}} = this
        this.setState({isEdit: false})
        setParams({wjxUrl: url})
    }

    toEdit = () => this.setState({isEdit: true})

    render(): React.ReactNode {
        return <section className={style.create}>

            <div className={style.inputUrl}>
                <div className={style.inputTip}>输入问卷星链接</div>
                {
                    this.state.isEdit ?
                        <input value={this.state.wjxUrl} onChange={this.inputWjxUrl}/> :
                        <a onClick={this.toEdit}>{this.state.wjxUrl}</a>
                }
            </div>
        </section>
    }
}

registerOnFramework('wjx', {
    localeNames: ['问卷星', 'WJX Phase'],
    Create
})
