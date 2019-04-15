import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, Label, RangeInput, Button, MaskLoading, Input} from 'bespoke-client-util'
import {Tabs} from './Tabs'
import {FetchType} from '../config'
import {ICreateParams, CreateParams} from '../interface'

interface ICreateState {
    activeGroupIndex: number
    activeRoundIndex: number
    minPrivatePrice: number
    maxPrivatePrice: number
}

export class Create extends Core.Create<ICreateParams, FetchType, ICreateState> {
    lang = Lang.extractLang({
        edit: ['编辑', 'EDIT'],
        done: ['完成', 'DONE'],
        group: ['组', 'Group'],
        groupIndex: [i => `第${i + 1}组`, i => `Group ${i + 1}`],
        groupSize: ['每组人数', 'GroupSize'],
        round: ['轮次', 'Round'],
        roundIndex: [i => `第${i + 1}轮`, i => `Round ${i + 1}`],
        privatePrice: ['心理价格', 'Private Price'],
        minPrivatePrice: ['最低心理价格', 'Min Private Price'],
        maxPrivatePrice: ['最高心理价格', 'Max Private Price'],
        generate: ['随机生成', 'Generate'],
        player: ['玩家', 'Player'],
        good: ['商品', 'Good']
    })
    state: ICreateState = {
        activeGroupIndex: 0,
        activeRoundIndex: 0,
        minPrivatePrice: 50,
        maxPrivatePrice: 100
    }

    componentDidMount(): void {
        let defaultParams: ICreateParams = {
            group: 3,
            groupSize: 8,
            round: 3
        }
        defaultParams.groupPPs = this.geneGroupPrivatePrices(defaultParams)
        this.props.setParams(defaultParams)
    }

    edit() {
        const {props: {setSubmitable}} = this
        setSubmitable(false)
    }

    done() {
        const {props: {setSubmitable}} = this
        setSubmitable(true)
    }

    geneGroupPrivatePrices({group, groupSize, round}: ICreateParams): Array<CreateParams.IGroupPP> {
        const {state: {minPrivatePrice, maxPrivatePrice}} = this
        return Array(group).fill(null).map(() => ({
            roundPPs: Array(round).fill(null).map(() => ({
                    playerPPs: Array(groupSize).fill(null).map(() => ({
                        privatePrices: Array(groupSize).fill(null).map(() =>
                            ~~(Math.random() * (maxPrivatePrice - minPrivatePrice)) + minPrivatePrice)
                    }))
                })
            )
        }))
    }

    updatePrivatePrice() {
        const {params, setParams} = this.props
        const groupPPs = this.geneGroupPrivatePrices(params)
        setParams({groupPPs})
    }

    renderBaseFields() {
        const {
            lang,
            props: {params: {group, groupSize, round}, setParams, submitable},
            state: {minPrivatePrice, maxPrivatePrice}
        } = this
        return <ul className={style.configFields} style={{visibility: submitable ? 'hidden' : 'visible'}}>
            <li>
                <Label label={lang.group}/>
                <RangeInput value={group}
                            min={3}
                            max={6}
                            onChange={({target: {value}}) => setParams({group: +value})}/>
            </li>
            <li>
                <Label label={lang.groupSize}/>
                <RangeInput value={groupSize}
                            min={3}
                            max={6}
                            onChange={({target: {value}}) => setParams({groupSize: +value})}/>
            </li>
            <li>
                <Label label={lang.round}/>
                <RangeInput value={round}
                            min={1}
                            max={10}
                            onChange={({target: {value}}) => setParams({round: +value})}/>
            </li>
            <li>
                <Label label={lang.minPrivatePrice}/>
                <RangeInput value={minPrivatePrice}
                            onChange={({target: {value}}) => {
                                this.setState({minPrivatePrice: +value})
                                if (value > maxPrivatePrice) {
                                    this.setState({maxPrivatePrice: +value})
                                }
                            }}/>
            </li>
            <li>
                <Label label={lang.maxPrivatePrice}/>
                <RangeInput value={maxPrivatePrice}
                            onChange={({target: {value}}) => {
                                this.setState({maxPrivatePrice: +value})
                                if (value < minPrivatePrice) {
                                    this.setState({minPrivatePrice: +value})
                                }
                            }}/>
            </li>
            <Button label={lang.generate}
                    onClick={async () => await this.updatePrivatePrice()}/>
        </ul>
    }

    render(): React.ReactNode {
        const {lang, props: {params: {groupPPs}, submitable}, state: {activeGroupIndex, activeRoundIndex}} = this
        if (!groupPPs) {
            return <MaskLoading/>
        }
        return <section className={style.create}>
            {
                this.renderBaseFields()
            }
            <Tabs labels={groupPPs.map((_, i) => lang.groupIndex(i))}
                  activeTabIndex={activeGroupIndex}
                  switchTab={i => this.setState({activeGroupIndex: i})}
            >
                {
                    groupPPs.map((group, i) =>
                        <Tabs labels={group.roundPPs.map((_, i) => lang.roundIndex(i))}
                              activeTabIndex={activeRoundIndex}
                              switchTab={i => this.setState({activeRoundIndex: i})}
                              vertical={true}
                        >
                            {
                                group.roundPPs.map((round, j) => this.renderGroupRound(i, j))
                            }

                        </Tabs>)
                }
            </Tabs>
            <div className={style.btnSwitch}>
                {
                    submitable ? <a onClick={() => this.edit()}>{lang.edit}</a> :
                        <a onClick={() => this.done()}>{lang.done}</a>
                }
            </div>
        </section>
    }

    renderGroupRound(groupIndex: number, roundIndex: number) {
        const {lang, props: {submitable, params: {groupPPs, groupSize}}} = this,
            {playerPPs} = groupPPs[groupIndex].roundPPs[roundIndex]
        return <table className={style.privatePriceTable}>
            <tbody>
            <tr>
                <td>{lang.privatePrice}</td>
                {

                    Array(groupSize).fill('').map((_, c) => <td key={c}>{lang.good}{c + 1}</td>)
                }
            </tr>
            {
                Array(groupSize).fill(null).map((_, r) => <tr key={r}>
                    <td>{lang.player}{r + 1}</td>
                    {
                        Array(groupSize).fill('').map((_, c) => {
                            const value = playerPPs[r].privatePrices[c]
                            return <td key={c} className={submitable ? style.readonly : null}>
                                <Input value={value}
                                       onChange={({target: {value}}) => {
                                           if (submitable) {
                                               return
                                           }
                                           console.log(value)
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
