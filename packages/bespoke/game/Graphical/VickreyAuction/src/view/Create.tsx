import * as React from 'react'
import * as style from './style.scss'
import {Core, Input, Label, Lang, RangeInput, Toast} from 'bespoke-client-util'
import cloneDeep = require('lodash/cloneDeep')
import {FetchType} from '../config'
import {ICreateParams} from '../interface'

interface ICreateState {
    edit: boolean
    round: number
    groupSize: number
    startingPrice: number
    privatePriceLimit: number
    privatePrice: Array<Array<number>>
}

export class Create extends Core.Create<ICreateParams, FetchType, ICreateState> {
    state: ICreateState = {
        edit: false,
        round: 3,
        groupSize: 4,
        startingPrice: 50,
        privatePriceLimit: 100,
        privatePrice: []
    }

    lang = Lang.extractLang({
        round: ['轮次', 'Round'],
        groupSize: ['每组人数', 'GroupSize'],
        startingPrice: ['起拍价', 'StartingPrice'],
        privatePriceLimit: ['心理价格上限', 'PrivatePriceLimit'],
        generate: ['随机生成', 'Generate'],
        privatePrice: ['心理价格', 'Private Price'],
        edit: ['编辑', 'EDIT'],
        done: ['完成', 'DONE'],
        checkPrivatePricePls: ['玩家心理价格有误，请检查', 'Private pricies of players are invalid, check them please']
    })

    componentDidMount(): void {
        this.generatePrivatePrice(() => this.submit())
    }

    generatePrivatePrice(callback?: () => void) {
        const {state: {round, groupSize, startingPrice, privatePriceLimit}} = this
        this.setState({
            privatePrice: Array(round).fill('')
                .map(
                    () => Array(groupSize).fill('').map(
                        () => ~~(Math.random() * (privatePriceLimit - startingPrice)) + startingPrice
                    )
                )
        }, callback)
    }

    renderPrivatePriceTable(readonly: boolean) {
        const {lang, state: {round, groupSize, privatePrice}} = this
        return <React.Fragment>
            <Label label={lang.privatePrice}/>
            <table className={style.privatePriceTable}>
                <tbody>
                <tr>
                    <td>{
                        readonly ? null : <a onClick={() => this.generatePrivatePrice()}>{lang.generate}</a>
                    }</td>
                    {

                        Array(groupSize).fill('').map((_, c) => <td
                            key={c}>P{c + 1}</td>)
                    }
                </tr>
                {
                    Array(round).fill('').map((_, r) => <tr key={r}>
                        <td>R{r + 1}</td>
                        {
                            Array(groupSize).fill('').map((_, c) => {
                                const value = (privatePrice[r] || [])[c] || ''
                                return <td
                                    key={c}>{
                                    readonly ? <span>{value}</span> :
                                        <Input value={value}
                                               onChange={({target: {value}}) => {
                                                   const newPrivatePrice = cloneDeep(privatePrice)
                                                   newPrivatePrice[r] = newPrivatePrice[r] || []
                                                   newPrivatePrice[r][c] = value as any
                                                   this.setState({privatePrice: newPrivatePrice})
                                               }}

                                        />
                                }</td>
                            })
                        }
                    </tr>)
                }</tbody>
            </table>
        </React.Fragment>
    }

    renderEditor(): React.ReactNode {
        const {lang, state: {round, groupSize, startingPrice, privatePriceLimit}} = this
        return <React.Fragment>
            <ul className={style.baseFields}>
                <li>
                    <Label label={lang.round}/>
                    <RangeInput value={round}
                                min={1}
                                max={12}
                                onChange={({target: {value}}) => this.setState({round: +value})}/>
                </li>
                <li>
                    <Label label={lang.groupSize}/>
                    <RangeInput value={groupSize}
                                min={3}
                                max={6}
                                onChange={({target: {value}}) => this.setState({groupSize: +value})}/>
                </li>
                <li>
                    <Label label={lang.startingPrice}/>
                    <RangeInput value={startingPrice}
                                onChange={({target: {value}}) => value <= privatePriceLimit ?
                                    this.setState({startingPrice: +value}) :
                                    this.setState({startingPrice: +value, privatePriceLimit: +value})
                                }/>
                </li>
                <li>
                    <Label label={lang.privatePriceLimit}/>
                    <RangeInput value={privatePriceLimit}
                                onChange={({target: {value}}) => value >= startingPrice ?
                                    this.setState({privatePriceLimit: +value}) :
                                    this.setState({privatePriceLimit: +value, startingPrice: +value})
                                }/>
                </li>
            </ul>
            {
                this.renderPrivatePriceTable(false)
            }
            <a className={style.btnSwitch} onClick={() => this.submit()}>{lang.done}</a>
        </React.Fragment>
    }

    submit() {
        const {lang, props: {setParams}, state: {round, groupSize, startingPrice, privatePrice}} = this
        const privvatePriceTable = Array(round).fill('').map(
            (_, r) => Array(groupSize).fill('').map((_, c) => (privatePrice[r] || [])[c])
        )
        if (privvatePriceTable.some(roundPrivatePrice => roundPrivatePrice.some(price => !price))) {
            return Toast.warn(lang.checkPrivatePricePls)
        }
        setParams({
            round, groupSize, startingPrice, privatePrice: privvatePriceTable.map(arr => arr.join(','))
        })
        this.setState({
            edit: false
        })
    }


    render() {
        const {state: {edit}} = this
        return <section className={style.create}>{
            edit ? this.renderEditor() : this.renderPreview()
        }</section>
    }

    renderPreview() {
        const {lang} = this
        return <React.Fragment>
            {
                this.renderPrivatePriceTable(true)
            }
            <a className={style.btnSwitch} onClick={() => this.setState({edit: true})}>{lang.edit}</a>
        </React.Fragment>
    }

}