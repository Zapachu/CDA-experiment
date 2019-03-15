import * as React from 'react'
import * as style from './style.scss'
import {ICreateParams} from '../interface'
import {Button, Core, Label, RangeInput} from 'bespoke-client-util'
import {FetchType} from "../config"

interface ICreateState {
    buyerL: number
    buyerH: number
    sellerL: number
    sellerH: number
    buyerPV: Array<number>
    sellerPV: Array<number>
    initV: number
    round: number
    groupSize: number
    readonly: boolean
    privatePriceLimit: number
}

export class Create extends Core.Create<ICreateParams, FetchType, ICreateState> {

    state: ICreateState = {
        buyerL: 0,
        buyerH: 100,
        sellerL: 0,
        sellerH: 100,
        buyerPV: [],
        sellerPV: [],
        initV: 100,
        round: 3,
        groupSize: 1,
        readonly: true,
        privatePriceLimit: 100,
    }

    genRand = (round: number, groupSize: number, L: number, H: number) => {
        return Array(round).fill(null).map(() =>
            Array(groupSize).fill(null).map(() =>
                ~~(Math.random() * (H - L)) + L).join(',')
        ).map(v => parseInt(v))
    }

    genPhase = () => {
        const {buyerL, buyerH, sellerL, sellerH, round, groupSize} = this.state
        const buyerPV = this.genRand(round, groupSize, buyerL, buyerH)
        const sellerPV = this.genRand(round, groupSize, sellerL, sellerH)
        this.setState({buyerPV, sellerPV})
    }

    render() {
        const {round, groupSize, buyerL, buyerH, sellerL, sellerH, initV, readonly} = this.state
        return <div>
            <ul className={style.configFields} style={{visibility: readonly ? 'hidden' : 'visible'}}>
                <li>
                    <Label label='轮次'/>
                    <RangeInput value={round}
                                min={1}
                                max={10}
                                onChange={(e) => this.setState({round: e.target.value})}/>
            </li>
            <li>
                <Label label='组数'/>
                <RangeInput value={groupSize}
                            min={3}
                            max={6}
                            onChange={(e) => this.setState({groupSize: e.target.value})}/>
            </li>
            <li>
                <Label label='初始资金'/>
                <RangeInput value={initV}
                            onChange={(e) => this.setState({initV: e.target.value})}/>
            </li>
            <li>
                <Label label='买家心理价值下限'/>
                <RangeInput value={buyerL}
                            onChange={(e) => this.setState({buyerL: e.target.value})}/>
            </li>
            <li>
                <Label label='买家心理价值上限'/>
                <RangeInput value={buyerH}
                            onChange={(e) => this.setState({buyerH: e.target.value})}/>
            </li>
            <li>
                <Label label='卖家心理价值下限'/>
                <RangeInput value={sellerL}
                            onChange={(e) => this.setState({sellerL: e.target.value})}/>
            </li>
            <li>
                <Label label='买家心理价值上限'/>
                <RangeInput value={sellerH}
                            onChange={(e) => this.setState({sellerH: e.target.value})}/>
            </li>
            <Button label='生成参数'
                    onClick={async () => await this.genPhase()}/>
        </ul>
    </div>
    }
}
