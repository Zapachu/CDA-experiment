import * as React from 'react'
import * as style from './style.scss'
import {Core, Input, Label, Lang, RangeInput, Toast, MaskLoading, Button} from 'bespoke-client-util'
import {ICreateParams} from '../interface'

interface ICreateState {
    readonly: boolean
    privatePriceLimit: number
}

export class Create extends Core.Create<ICreateParams, ICreateState> {
    lang = Lang.extractLang({
        round: ['轮次', 'Round'],
        player: ['玩家', 'Player'],
        groupSize: ['每组人数', 'GroupSize'],
        startingPrice: ['起拍价', 'StartingPrice'],
        privatePriceLimit: ['心理价格上限', 'PrivatePriceLimit'],
        generate: ['随机生成', 'Generate'],
        privatePrice: ['心理价格', 'Private Price'],
        edit: ['编辑', 'EDIT'],
        done: ['完成', 'DONE'],
        checkPrivatePricePls: ['玩家心理价格有误，请检查', 'Private pricies of players are invalid, check them please']
    })

    state: ICreateState = {
        readonly: true,
        privatePriceLimit: 100
    }

    componentDidMount(): void {
        const {state: {privatePriceLimit}, props: {setParams}} = this
        let defaultParams: ICreateParams = {
            round: 3,
            groupSize: 4,
            startingPrice: 50
        }
        defaultParams.privatePrice = this.genePrivatePrice(defaultParams, privatePriceLimit)
        setParams(defaultParams)
    }

    genePrivatePrice({round, groupSize, startingPrice}: ICreateParams, privatePriceLimit: number) {
        return Array(round).fill(null).map(() => Array(groupSize).fill(null).map(
            () => ~~(Math.random() * (privatePriceLimit - startingPrice)) + startingPrice
            ).join(',')
        )
    }

    updatePrivatePrice() {
        const {props: {params, setParams}, state: {privatePriceLimit}} = this
        const privatePrice = this.genePrivatePrice(params, privatePriceLimit)
        setParams({privatePrice})
    }

    edit() {
        const {props: {setSubmitable}} = this
        this.setState({readonly: false})
        setSubmitable(false)
    }

    done() {
        const {lang, props: {setParams, setSubmitable, params: {round, groupSize, startingPrice, privatePrice}}} = this
        const privatePriceTable = Array(round).fill(null).map(
            (_, r) => Array(groupSize).fill(null).map((_, c) => (privatePrice[r] || '').split(',')[c])
        )
        if (privatePriceTable.some(roundPrivatePrice => roundPrivatePrice.some(price => !price))) {
            return Toast.warn(lang.checkPrivatePricePls)
        }
        setParams({
            round, groupSize, startingPrice, privatePrice: privatePriceTable.map(arr => arr.join(','))
        })
        this.setState({
            readonly: true
        })
        setSubmitable(true)
    }

    render() {
        const {lang, props: {params: {privatePrice}}, state: {readonly}} = this
        if (!privatePrice) {
            return <MaskLoading/>
        }
        return <section className={style.create}>
            {
                this.renderBaseFields()
            }
            {
                this.renderPrivatePrice()
            }
            <div className={style.btnSwitch}>
                {
                    readonly ? <a onClick={() => this.edit()}>{lang.edit}</a> :
                        <a onClick={() => this.done()}>{lang.done}</a>
                }
            </div>
        </section>
    }

    renderBaseFields() {
        const {
            lang,
            props: {params: {round, groupSize, startingPrice}, setParams},
            state: {privatePriceLimit, readonly}
        } = this
        return <ul className={style.configFields} style={{visibility: readonly ? 'hidden' : 'visible'}}>
            <li>
                <Label label={lang.round}/>
                <RangeInput value={round}
                            min={1}
                            max={10}
                            onChange={({target: {value}}) => setParams({round: +value})}/>
            </li>
            <li>
                <Label label={lang.groupSize}/>
                <RangeInput value={groupSize}
                            min={3}
                            max={6}
                            onChange={({target: {value}}) => setParams({groupSize: +value})}/>
            </li>
            <li>
                <Label label={lang.startingPrice}/>
                <RangeInput value={startingPrice}
                            onChange={({target: {value}}) => {
                                setParams({startingPrice: +value})
                                if (value > privatePriceLimit) {
                                    this.setState({privatePriceLimit: +value})
                                }
                            }}/>
            </li>
            <li>
                <Label label={lang.privatePriceLimit}/>
                <RangeInput value={privatePriceLimit}
                            onChange={({target: {value}}) => {
                                this.setState({privatePriceLimit: +value})
                                if (value < startingPrice) {
                                    setParams({startingPrice: +value})
                                }
                            }}/>
            </li>
            <Button label={lang.generate}
                    onClick={async () => await this.updatePrivatePrice()}/>
        </ul>
    }

    renderPrivatePrice() {
        const {lang, props: {params: {round, groupSize, privatePrice}, setParams}, state: {readonly}} = this
        return <table className={style.privatePriceTable}>
            <tbody>
            <tr>
                <td>{lang.privatePrice}</td>
                {

                    Array(groupSize).fill('').map((_, c) => <td
                        key={c}>{lang.player}{c + 1}</td>)
                }
            </tr>
            {
                Array(round).fill('').map((_, r) => <tr key={r}>
                    <td>{lang.round}{r + 1}</td>
                    {
                        Array(groupSize).fill('').map((_, c) => {
                            const value = (privatePrice[r] || '').split(',')[c] || ''
                            return <td key={c} className={readonly ? style.readonly : null}>
                                <Input value={value}
                                       onChange={({target: {value}}) => {
                                           if (readonly) {
                                               return
                                           }
                                           const newPrivatePrice = privatePrice.slice(),
                                               prices = (newPrivatePrice[r] || '').split(',')
                                           prices[c] = value
                                           newPrivatePrice[r] = prices.join(',')
                                           setParams({privatePrice: newPrivatePrice})
                                       }}

                                />
                            </td>
                        })
                    }
                </tr>)
            }</tbody>
        </table>
    }
}