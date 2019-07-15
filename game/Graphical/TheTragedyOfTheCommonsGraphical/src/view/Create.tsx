import * as React from 'react'
import * as style from './style.scss'
import {ICreateParams} from '../interface'
import {Label, RangeInput, Toast} from '@elf/component'
import {Core} from '@bespoke/register'

interface ICreateState {
    fishCount: number
    magnification: string
    round: number
    groupSize: number
    readonly: boolean
}

export class Create extends Core.Create<ICreateParams, ICreateState> {

    state: ICreateState = {
        fishCount: 100,
        magnification: '2',
        round: 3,
        groupSize: 2,
        readonly: false
    }

    componentDidMount(): void {
        const {props: {setParams}} = this
        const {round, groupSize, fishCount, magnification} = this.state
        setParams({round, groupSize, fishCount, magnification: parseFloat(magnification)})
    }

    edit = () => {
        const {props: {setSubmitable}} = this
        this.setState({readonly: false})
        setSubmitable(false)
    }

    done = () => {
        const {setParams, setSubmitable} = this.props
        const {round, groupSize, fishCount, magnification: magStr} = this.state
        const magnification = parseFloat(magStr)
        if (isNaN(magnification)) {
            return Toast.error('参数格式不正确')
        }
        setParams({round, groupSize, fishCount, magnification})
        this.setState({readonly: true})
        setSubmitable(true)
    }

    setGroupSize = (e) => {
        const val = parseInt(e.target.value)
        this.setState({groupSize: val % 2 === 0 ? val : val + 1})
    }

    render() {
        const {round, groupSize, fishCount, magnification, readonly} = this.state
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
                                max={8}
                                onChange={this.setGroupSize}/>
                </li>
                <li>
                    <Label label='初始鱼的条数'/>
                    <RangeInput value={fishCount}
                                onChange={(e) => this.setState({fishCount: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='翻倍比率'/>
                    <RangeInput value={magnification}
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
