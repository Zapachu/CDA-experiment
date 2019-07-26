import * as React from 'react'
import * as style from './style.scss'
import {ICreateParams} from '../interface'
import {Core} from '@bespoke/client'
import {Label, RangeInput} from '@elf/component'
interface ICreateState {
    rightReward: number,
    falseReward: number,
    round: number
    groupSize: number
    readonly: boolean
}

export class Create extends Core.Create<ICreateParams, ICreateState> {

    state: ICreateState = {
        rightReward: 100,
        falseReward: 0,
        round: 3,
        groupSize: 2,
        readonly: false,
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
        const {round, groupSize, rightReward, falseReward} = this.state
        setParams({round, groupSize, rightReward, falseReward})
        this.setState({readonly: true})
        setSubmitable(true)
    }

    render() {
        const {round, groupSize, rightReward, falseReward, readonly} = this.state
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
                                min={0}
                                amx={50}
                                onChange={(e) => this.setState({groupSize: parseInt(e.target.value)})}
                    />
                </li>
                <li>
                    <Label label='预测正确的报酬'/>
                    <RangeInput value={rightReward}
                                min={0}
                                amx={100}
                                onChange={(e) => this.setState({rightReward: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='预测错误的报酬'/>
                    <RangeInput value={falseReward}
                                min={0}
                                amx={100}
                                onChange={(e) => this.setState({falseReward: parseInt(e.target.value)})}/>
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
