import * as React from 'react'
import * as style from './style.scss'
import {ICreateParams} from '../interface'
import {Button, Core, Label, RangeInput, Input} from 'bespoke-client-util'
import {FetchType} from "../config"

interface ICreateState {
    buyerPriceStart: number
    buyerPriceEnd: number
    sellerPriceStart: number
    sellerPriceEnd: number
    waitingSeconds: number
    InitMoney: number
    round: number
    groupSize: number
    positions: Array<{
        role: number
        privatePrice: Array<number>
    }>
    readonly: boolean
}

export class Create extends Core.Create<ICreateParams, FetchType, ICreateState> {

    state: ICreateState = {
        buyerPriceStart: 0,
        buyerPriceEnd: 100,
        sellerPriceStart: 0,
        sellerPriceEnd: 100,
        InitMoney: 100,
        round: 3,
        waitingSeconds: 10,
        groupSize: 2,
        positions: [{role: 0, privatePrice: [10, 40, 60]}, {role: 1, privatePrice: [30, 50, 60]}],
        readonly: false,
    }

    componentDidMount(): void {
        const {props: {setSubmitable}} = this
        setSubmitable(false)
    }

    genRan = ({L, H}) => ~~(Math.random() * (H - L)) + L

    genPosition = (i) => {
        const {buyerPriceStart, buyerPriceEnd, sellerPriceStart, sellerPriceEnd, round} = this.state
        const role = i % 2
        return {
            role,
            privatePrice: Array(round).fill(null).map(() => this.genRan([{L: buyerPriceStart, H: buyerPriceEnd}, {L: sellerPriceStart, H: sellerPriceEnd}][role]))
        }
    }

    genParams = () => {
        const {groupSize} = this.state
        const positions = Array(groupSize).fill(null).map((v, i) => this.genPosition(i))
        this.setState({positions})
    }

    resetRole = (i) => {
        const {positions} = this.state
        positions[i].role = positions[i].role === 0 ? 1 : 0
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
        const {round, groupSize, positions, InitMoney} = this.state
        setParams({round, groupSize, positions, InitMoney})
        this.setState({readonly: true})
        setSubmitable(true)
    }

    render() {
        const {round, groupSize, buyerPriceStart, buyerPriceEnd, sellerPriceStart, sellerPriceEnd, InitMoney, positions, readonly} = this.state
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
                                max={6}
                                onChange={(e) => this.setState({groupSize: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='初始资金'/>
                    <RangeInput value={InitMoney}
                                onChange={(e) => this.setState({InitMoney: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='买家心理价值下限'/>
                    <RangeInput value={buyerPriceStart}
                                onChange={(e) => this.setState({buyerPriceStart: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='买家心理价值上限'/>
                    <RangeInput value={buyerPriceEnd}
                                onChange={(e) => this.setState({buyerPriceEnd: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='卖家心理价值下限'/>
                    <RangeInput value={sellerPriceStart}
                                onChange={(e) => this.setState({sellerPriceStart: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='卖家心理价值上限'/>
                    <RangeInput value={sellerPriceEnd}
                                onChange={(e) => this.setState({sellerPriceEnd: parseInt(e.target.value)})}/>
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
                    <td>角色</td>
                    <td>心理价值</td>
                </tr>
                </thead>
                {
                    positions.map((v, i) =>
                        <tbody key={`tb${i}`}>
                        <tr>
                            <td>{`Player ${i + 1}`}</td>
                            <td>
                                <a style={{color: v.role === 0 ? 'blue' : '#333'}}
                                   onClick={this.resetRole.bind(this, i)}>Buyer</a>
                                <a style={{color: v.role === 1 ? 'blue' : '#333'}}
                                   onClick={this.resetRole.bind(this, i)}>Seller</a>
                            </td>
                            <td>
                                {
                                    v.privatePrice.map((v1, i1) =>
                                        <li key={`pv-${i}-${i1}`} >
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
