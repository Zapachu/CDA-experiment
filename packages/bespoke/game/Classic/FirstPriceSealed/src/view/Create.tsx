import * as React from 'react'
import * as style from './style.scss'
import {ICreateParams} from '../interface'
import {Core, Label, RangeInput, Input, Button} from 'bespoke-client-util'
interface ICreateState {
    startingPrice: number
    maxPrivatePrice: number
    positions: Array<{
        privatePrice: Array<number>
    }>
    round: number
    groupSize: number
    readonly: boolean
}

export class Create extends Core.Create<ICreateParams, ICreateState> {

    state: ICreateState = {
        startingPrice: 10,
        maxPrivatePrice: 100,
        positions: [{privatePrice: [101, 98, 102]}, {privatePrice: [97, 99, 103]}],
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

    genParams = () => {
        const {groupSize} = this.state
        const positions = Array(groupSize).fill(null).map(() => this.genPosition())
        this.setState({positions})
    }

    genRan = ({L, H}) => ~~(Math.random() * (H - L)) + L

    genPosition = () => {
        const {maxPrivatePrice, startingPrice, round} = this.state
        return {
            privatePrice: Array(round).fill(null).map(() => this.genRan({
                L: startingPrice,
                H: maxPrivatePrice
            }))
        }
    }

    resetPrivatePrice = (i, i1, e) => {
        const {positions} = this.state
        positions[i].privatePrice[i1] = parseInt(e.target.value)
        this.setState({positions})
    }


    done = () => {
        const {setParams, setSubmitable} = this.props
        const {round, groupSize, positions, startingPrice, maxPrivatePrice} = this.state
        setParams({round, groupSize, positions, maxPrivatePrice, startingPrice})
        this.setState({readonly: true})
        setSubmitable(true)
    }

    render() {
        const {round, groupSize, positions, startingPrice, maxPrivatePrice, readonly} = this.state
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
                    <Label label='起拍价'/>
                    <RangeInput value={startingPrice}
                                min={0}
                                max={1000}
                                onChange={(e) => this.setState({startingPrice: parseInt(e.target.value)})}/>
                </li>
                <li>
                    <Label label='最大心理价值'/>
                    <RangeInput value={maxPrivatePrice}
                                min={0}
                                max={1000}
                                onChange={(e) => this.setState({maxPrivatePrice: parseInt(e.target.value)})}/>
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
