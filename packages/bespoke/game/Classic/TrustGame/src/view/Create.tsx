import * as React from 'react'
import * as style from './style.scss'
import {ICreateParams} from '../interface'
import {Core, Label, RangeInput, Input, Toast} from 'bespoke-client-util'
import {FetchType} from "../config"

interface ICreateState {
    initialFunding: number,
    magnification: string,
    round: number
    groupSize: number
    readonly: boolean
}

export class Create extends Core.Create<ICreateParams, FetchType, ICreateState> {

    state: ICreateState = {
        initialFunding: 100,
        magnification: '2',
        round: 3,
        groupSize: 2,
        readonly: true,
    }

    edit = () => {
        const {props: {setSubmitable}} = this
        this.setState({readonly: false})
        setSubmitable(false)
    }

    done = () => {
        const {setParams, setSubmitable} = this.props
        const {round, groupSize, initialFunding, magnification} = this.state
        if (isNaN(parseFloat(magnification))) {
            return Toast.error('请输入正确的回报比')
        }

        setParams({round, groupSize, initialFunding, magnification: parseFloat(magnification)})
        this.setState({readonly: true})
        setSubmitable(true)
    }

    render() {
        const {round, initialFunding, magnification, readonly} = this.state
        return <div className={style.create}>
            <ul className={style.configFields}>
                <li>
                    <Label label='轮次'/>
                    <RangeInput value={round}
                                min={1}
                                max={10}
                                onChange={(e) => this.setState({round: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='每组人数'/>
                    <RangeInput value={2} disabled={true}/>
                </li>
                <li>
                    <Label label='初始资金'/>
                    <RangeInput value={initialFunding}
                                onChange={(e) => this.setState({initialFunding: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='翻倍比率'/>
                    <Input value={magnification}
                           onChange={(e) => this.setState({magnification: e.target.value})}/>
                </li>
            </ul>

            <div className={style.btnSwitch}>
                {
                    readonly ? <a onClick={() => this.edit()}>重新编辑</a> :
                        <a onClick={() => this.done()}>确认参数</a>
                }
            </div>
        </div>
    }
}
