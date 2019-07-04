import * as React from 'react'
import * as style from './style.scss'
import {ICreateParams} from '../interface'
import {Button, Input, Label, RadioGroup, RangeInput} from '@elf/component'
import {Core} from '@bespoke/register'

interface ICreateState {
    commonValue: number
    deviation: number
    round: number
    groupSize: number
    positions: Array<{
        privatePrice: Array<number>
    }>
    winnerNumber: number
    readonly: boolean
    mode: string
}

const winnerModes = [
    '最高出价的前 m 位玩家胜利',
    '出价大于所有玩家出价中位数的 m位玩家胜利'
]

export class Create extends Core.Create<ICreateParams, ICreateState> {

    state: ICreateState = {
        commonValue: 100,
        deviation: 5,
        round: 3,
        groupSize: 2,
        positions: [{privatePrice: [101, 98, 102]}, {privatePrice: [97, 99, 103]}],
        winnerNumber: 2,
        readonly: false,
        mode: winnerModes[0]
    }

    componentDidMount(): void {
        const {props: {setSubmitable}} = this
        setSubmitable(false)
    }

    genRan = ({L, H}) => ~~(Math.random() * (H - L)) + L

    genPosition = () => {
        const {commonValue, deviation, round} = this.state
        return {
            privatePrice: Array(round).fill(null).map(() => this.genRan({
                L: commonValue - deviation,
                H: commonValue + deviation
            }))
        }
    }

    genParams = () => {
        const {groupSize} = this.state
        const positions = Array(groupSize).fill(null).map(() => this.genPosition())
        this.setState({positions})
    }

    resetPrivatePrice = (i, i1, e) => {
        const {positions} = this.state
        positions[i].privatePrice[i1] = parseInt(e.target.value)
        this.setState({positions})
    }

    edit = () => {
        const {props: {setSubmitable}} = this
        this.setState({readonly: false})
        setSubmitable(false)
    }

    done = () => {
        const {setParams, setSubmitable} = this.props
        const {round, groupSize, positions, mode, commonValue, deviation, winnerNumber} = this.state
        setParams({round, groupSize, positions, commonValue, deviation, mode: winnerModes.indexOf(mode), winnerNumber})
        this.setState({readonly: true})
        setSubmitable(true)
    }

    render() {
        const {round, groupSize, commonValue, deviation, positions, readonly, mode, winnerNumber} = this.state
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
                    <Label label='游戏胜利人数'/>
                    <RangeInput value={winnerNumber}
                                min={1}
                                max={groupSize}
                                onChange={(e) => this.setState({winnerNumber: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='买家公共价值'/>
                    <RangeInput value={commonValue}
                                onChange={(e) => this.setState({commonValue: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='买家价值偏差'/>
                    <RangeInput value={deviation}
                                onChange={(e) => this.setState({deviation: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='获胜方式'/>
                    <RadioGroup value={mode} options={winnerModes}
                                onChange={(v) => this.setState({mode: v})}/>
                </li>
                <li>
                    <Button label='生成参数'
                            onClick={async () => await this.genParams()}/>
                </li>
            </ul>

            <table className={style.privatePriceTable}>
                <thead>
                <tr>
                    <td>玩家</td>
                    <td>心理价值</td>
                </tr>
                </thead>
                {
                    positions.map((v, i) =>
                        <tbody key={`tb${i}`}>
                        <tr>
                            <td>{`Player ${i + 1}`}</td>
                            <td>
                                {
                                    v.privatePrice.map((v1, i1) =>
                                        <li key={`pv-${i}-${i1}`}>
                                            <Label label={`第 ${i1 + 1} 轮`}/>
                                            <Input type='number' value={v1}
                                                   onChange={this.resetPrivatePrice.bind(this, i, i1)}/>
                                        </li>
                                    )
                                }
                            </td>
                        </tr>
                        </tbody>
                    )
                }
            </table>

            <div className={style.btnSwitch}>
                {
                    readonly ? <a onClick={() => this.edit()}>重新编辑</a> :
                        <a onClick={() => this.done()}>确认参数</a>
                }
            </div>
        </div>
    }
}
