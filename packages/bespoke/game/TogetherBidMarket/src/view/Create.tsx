import * as React from 'react'
import * as style from './style.scss'
import {ICreateParams} from '../interface'
import {Button, Core, Label, RangeInput, Input} from 'bespoke-client-util'
import {FetchType} from "../config"

interface ICreateState {
    buyerL: number
    buyerH: number
    sellerL: number
    sellerH: number
    initV: number
    round: number
    groupSize: number
    positions: Array<{
        role: number
        PV: number
    }>
    readonly: boolean
    privatePriceLimit: number
}

export class Create extends Core.Create<ICreateParams, FetchType, ICreateState> {

    state: ICreateState = {
        buyerL: 0,
        buyerH: 100,
        sellerL: 0,
        sellerH: 100,
        initV: 100,
        round: 3,
        groupSize: 2,
        positions: [{role: 0, PV: 45}, {role: 0, PV: 55}],
        readonly: false,
        privatePriceLimit: 100,
    }

    genRan = ({L, H}) => ~~(Math.random() * (H - L)) + L

    genPosition = () => {
        const {buyerL, buyerH, sellerL, sellerH} = this.state
        const role = this.genRan({L: 0, H: 2})
        return {
            role,
            PV: this.genRan([{L: buyerL, H: buyerH}, {L: sellerL, H: sellerH}][role])
        }
    }

    genParams = () => {
        const {groupSize} = this.state
        const positions = Array(groupSize).fill(null).map(() => this.genPosition())
        this.setState({positions})
    }

    resetRole = (i) => {
        const {positions} = this.state
        positions[i].role = positions[i].role === 0 ? 1 : 0
        this.setState({positions})
    }

    resetPV = (i, e) => {
        const {positions} = this.state
        positions[i].PV = parseInt(e.target.value)
        this.setState({positions})
    }

    render() {
        const {round, groupSize, buyerL, buyerH, sellerL, sellerH, initV, positions, readonly} = this.state
        return <div className={style.create}>
            <ul className={style.configFields} style={{visibility: readonly ? 'hidden' : 'visible'}}>
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
                                min={1}
                                max={6}
                                onChange={(e) => this.setState({groupSize: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='初始资金'/>
                    <RangeInput value={initV}
                                onChange={(e) => this.setState({initV: parseInt(e.target.value)})}/>
                </li>
                <Button label='生成参数'
                        onClick={async () => await this.genParams()}/>
            </ul>
            <ul className={style.configFields} style={{visibility: readonly ? 'hidden' : 'visible'}}>
                <li>
                    <Label label='买家心理价值下限'/>
                    <RangeInput value={buyerL}
                                onChange={(e) => this.setState({buyerL: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='买家心理价值上限'/>
                    <RangeInput value={buyerH}
                                onChange={(e) => this.setState({buyerH: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='卖家心理价值下限'/>
                    <RangeInput value={sellerL}
                                onChange={(e) => this.setState({sellerL: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='卖家心理价值上限'/>
                    <RangeInput value={sellerH}
                                onChange={(e) => this.setState({sellerH: parseInt(e.target.value)})}/>
                </li>
            </ul>

            <table className={style.privatePriceTable}>
                <thead>
                <th>玩家</th>
                <th>角色</th>
                <th>心理价值</th>
                </thead>
                {
                    positions.map((v, i) =>
                        <tbody>
                        <tr>
                            <td>{`Player ${i + 1}`}</td>
                            <td>
                                <a style={{color: v.role === 0 ? 'blue' : '#333'}}
                                   onClick={this.resetRole.bind(this, i)}>Buyer</a>
                                <a style={{color: v.role === 1 ? 'blue' : '#333'}}
                                   onClick={this.resetRole.bind(this, i)}>Seller</a>
                            </td>
                            <td>
                                <Input type='number' value={v.PV} onChange={this.resetPV.bind(this, i)}/>
                            </td>
                        </tr>
                        </tbody>
                    )
                }
            </table>
        </div>
    }
}
