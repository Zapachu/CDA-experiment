import * as React from 'react'
import * as style from './style.scss'
import {ICreateParams} from '../interface'
import {Input, Label, RangeInput, Toast} from 'elf-component'
import {Core} from '@bespoke/client-sdk'

interface ICreateState {
    initialFunding: number,
    returnOnInvestment: string,
    round: number
    groupSize: number
    readonly: boolean
}

export class Create extends Core.Create<ICreateParams, ICreateState> {

    state: ICreateState = {
        initialFunding: 100,
        returnOnInvestment: '1.2',
        round: 3,
        groupSize: 2,
        readonly: false
    }

    componentDidMount(): void {
        const {props: {setSubmitable}} = this
        setSubmitable(false)
    }

    edit = () => {
        const {props: {setSubmitable}} = this
        this.setState({readonly: false})
        setSubmitable(false)
    }

    done = () => {
        const {setParams, setSubmitable} = this.props
        const {round, groupSize, initialFunding, returnOnInvestment} = this.state
        if (isNaN(parseFloat(returnOnInvestment))) {
            return Toast.error('请输入正确的回报比')
        }

        setParams({round, groupSize, initialFunding, returnOnInvestment: parseFloat(returnOnInvestment)})
        this.setState({readonly: true})
        setSubmitable(true)
    }

    render() {
        const {round, groupSize, initialFunding, returnOnInvestment, readonly} = this.state
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
                    <RangeInput value={groupSize}
                                min={2}
                                max={100}
                                onChange={(e) => this.setState({groupSize: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='初始资金'/>
                    <RangeInput value={initialFunding}
                                onChange={(e) => this.setState({initialFunding: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='投资回报比'/>
                    <Input value={returnOnInvestment}
                           onChange={(e) => this.setState({returnOnInvestment: e.target.value})}/>
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
