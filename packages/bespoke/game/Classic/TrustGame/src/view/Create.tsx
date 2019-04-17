import * as React from 'react'
import * as style from './style.scss'
import {ICreateParams} from '../interface'
import {Core, Label, RangeInput, Input, Toast} from 'bespoke-client-util'
import {FetchType} from "../config"

interface IGroupParams {
    initialFunding: number
    magnification: number
}

interface ICreateState {
    initialFunding: number
    magnification: string
    round: number
    group: number
    groupParams: Array<IGroupParams>
    groupSize: number
}

export class Create extends Core.Create<ICreateParams, FetchType, ICreateState> {

    state: ICreateState = {
        initialFunding: 100,
        magnification: '2',
        round: 3,
        group: 2,
        groupParams: [{initialFunding: 100, magnification: 2}, {initialFunding: 100, magnification: 2}],
        groupSize: 2,
    }

    setGroup = (e) => {
        const curGroupCount = parseInt(e.target.value)
        const {group, groupParams} = this.state
        const repeatParams = groupParams[group - 1]
        if (curGroupCount > group) {
            while (groupParams.length !== curGroupCount) {
                groupParams.push(repeatParams)
            }
        } else {
            groupParams.splice(curGroupCount, group)
        }
        this.setState({group: curGroupCount, groupParams})
    }

    setInitialFunding = (e) => {
        const {groupParams} = this.state
        const initialFunding = parseInt(e.target.value)
        for (const eachGroupParams of groupParams) {
            eachGroupParams.initialFunding = initialFunding
        }
        this.setState({initialFunding, groupParams})
    }

    setMagnification = (e) => {
        const {groupParams} = this.state
        const magnification = e.target.value
        if (isNaN(parseFloat(magnification))) {
            return Toast.error('参数不合法， 需为数字')
        }
        for (const eachGroupParams of groupParams) {
            eachGroupParams.magnification = magnification
        }
        this.setState({magnification, groupParams})
    }

    resetVal = (i, name, e) => {
        const {groupParams} = this.state
        const stringVal = e.target.value
        if (isNaN(parseInt(e.target.value))) {
            return Toast.error('输入不合法，需为数字')
        }
        groupParams[i][name] = name === 'magnification' ? parseFloat(stringVal) : parseInt(stringVal)
        this.setState({groupParams})
    }

    done = () => {
        const {setParams, setSubmitable} = this.props
        const {round, group, groupSize, groupParams} = this.state
        setParams({round, group, groupParams, groupSize})
        setSubmitable(true)
    }

    componentDidMount(): void {
        const {setParams, setSubmitable} = this.props
        const {round, group, groupSize, groupParams} = this.state
        setParams({round, group, groupParams, groupSize})
        setSubmitable(true)
    }

    render() {
        const {round, group, groupParams, initialFunding, magnification} = this.state
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
                    <Label label='组数'/>
                    <RangeInput
                        min={1}
                        max={32}
                        onChange={this.setGroup}
                        value={group}/>
                </li>
                <li>
                    <Label label='每组人数'/>
                    <RangeInput value={2} disabled={true}/>
                </li>
                <li>
                    <Label label='初始资金'/>
                    <RangeInput value={initialFunding}
                                onChange={this.setInitialFunding}/>
                </li>
                <li>
                    <Label label='翻倍比率'/>
                    <Input value={magnification}
                           onChange={this.setMagnification}/>
                </li>
            </ul>

            <table className={style.privatePriceTable}>
                <thead>
                <tr>
                    <td>组编号</td>
                    <td>初始资金</td>
                    <td>翻倍比率</td>
                </tr>
                </thead>
                {
                    groupParams.map((v, i) =>
                        <tbody key={`tb${i}`}>
                        <tr>
                            <td>{`Player ${i + 1}`}</td>
                            <td>
                                <Input type='number' value={v.initialFunding}
                                       onChange={this.resetVal.bind(this, i, 'initialFunding')}/>
                            </td>
                            <td>
                                <Input type='number' value={v.magnification}
                                       onChange={this.resetVal.bind(this, i, 'magnification')}/>
                            </td>
                        </tr>
                        </tbody>
                    )
                }
            </table>
        </div>
    }
}
