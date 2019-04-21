import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, Label, RangeInput, Button, MaskLoading, Input, Toast, Tabs} from 'bespoke-client-util'
import {FetchType} from '../config'
import {ICreateParams, CreateParams} from '../interface'
import cloneDeep = require('lodash/cloneDeep')

const RANGE = {
    group: {
        min: 3,
        max: 6
    },
    round: {
        min: 1,
        max: 6
    },
    groupSize: {
        min: 4,
        max: 8
    }
}

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
        good: ['商品', 'Good'],
        checkPrivatePricePls: [
            (g, r, p, good) => `玩家心理价格有误，请检查：第${g + 1}组:第${r + 1}轮:玩家${p + 1}:物品${good + 1}`,
            (g, r, p, good) => `Private prices of players are invalid, check them please : Group${g + 1}:Round${r + 1}:Player${p + 1}:Good${good + 1}`
        ]
    })
    state: ICreateState = {
        activeGroupIndex: 0,
        activeRoundIndex: 0,
        minPrivatePrice: 50,
        maxPrivatePrice: 100
    }

    componentDidMount(): void {
        let defaultParams: ICreateParams = {
            group: RANGE.group.max,
            groupSize: RANGE.groupSize.max,
            round: RANGE.round.max
        }
        defaultParams.groupPPs = this.geneGroupPrivatePrices(defaultParams)
        this.props.setParams(defaultParams)
    }

    edit() {
        const {props: {setSubmitable}} = this
        setSubmitable(false)
    }

    done() {
        const {lang, props: {setSubmitable, params: {round, groupSize, group, groupPPs}, setParams}} = this
        let invalidIndex: {
            groupIndex: number
            roundIndex: number
            playerIndex: number
            goodIndex: number
        } = null
        const _groupPPs = Array(group).fill(null).map((_, groupIndex) => ({
            roundPPs: Array(round).fill(null).map((_, roundIndex) => ({
                    playerPPs: Array(groupSize).fill(null).map((_, playerIndex) => ({
                        privatePrices: Array(groupSize).fill(null).map((_, goodIndex) => {
                            if (invalidIndex) {
                                return null
                            }
                            const price = +groupPPs[groupIndex].roundPPs[roundIndex].playerPPs[playerIndex].privatePrices[goodIndex]
                            if (price <= 0 || isNaN(price)) {
                                invalidIndex = {groupIndex, roundIndex, playerIndex, goodIndex}
                                return null
                            }
                            return price
                        })
                    }))
                })
            )
        }))
        if (invalidIndex) {
            const {groupIndex, roundIndex, playerIndex, goodIndex} = invalidIndex
            return Toast.warn(lang.checkPrivatePricePls(groupIndex, roundIndex, playerIndex, goodIndex))
        }
        setParams({groupPPs: _groupPPs})
        setSubmitable(true)
    }

    geneGroupPrivatePrices({group, groupSize, round}: ICreateParams): Array<CreateParams.IGroupPP> {
        const {state: {minPrivatePrice, maxPrivatePrice}} = this
        return Array(RANGE.group.max).fill(null).map((_, groupIndex) => ({
            roundPPs: Array(RANGE.round.max).fill(null).map((_, roundIndex) => ({
                    playerPPs: Array(RANGE.groupSize.max).fill(null).map((_, playerIndex) => ({
                        privatePrices: Array(RANGE.groupSize.max).fill(null).map((_, goodIndex) =>
                            groupIndex < group &&
                            roundIndex < round &&
                            playerIndex < groupSize &&
                            goodIndex < groupSize ?
                                ~~(Math.random() * (maxPrivatePrice - minPrivatePrice)) + minPrivatePrice : null
                        )
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
            state: {activeGroupIndex, activeRoundIndex, minPrivatePrice, maxPrivatePrice}
        } = this
        return <ul className={style.configFields} style={{visibility: submitable ? 'hidden' : 'visible'}}>
            <li>
                <Label label={lang.group}/>
                <RangeInput {...RANGE.group} value={group}
                            onChange={({target: {value}}) => {
                                setParams({group: +value})
                                if (value < activeGroupIndex) {
                                    this.setState({activeGroupIndex: +value})
                                }
                            }}/>
            </li>
            <li>
                <Label label={lang.groupSize}/>
                <RangeInput {...RANGE.groupSize} value={groupSize}
                            onChange={({target: {value}}) => {
                                setParams({groupSize: +value})
                                if (value < activeRoundIndex) {
                                    this.setState({activeRoundIndex: +value})
                                }
                            }}/>
            </li>
            <li>
                <Label label={lang.round}/>
                <RangeInput {...RANGE.round} value={round}
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
        const {lang, props: {params: {group, round, groupPPs}, submitable}, state: {activeGroupIndex, activeRoundIndex}} = this
        if (!groupPPs) {
            return <MaskLoading/>
        }
        const groupIterator = Array(group).fill(null),
            roundIterator = Array(round).fill(null)
        return <section className={style.create}>
            {
                this.renderBaseFields()
            }
            <Tabs labels={groupIterator.map((_, i) => lang.groupIndex(i))}
                  activeTabIndex={activeGroupIndex}
                  switchTab={i => this.setState({activeGroupIndex: i})}
            >
                {
                    groupIterator.map((_, i) =>
                        <Tabs key={i} labels={roundIterator.map((_, i) => lang.roundIndex(i))}
                              activeTabIndex={activeRoundIndex}
                              switchTab={i => this.setState({activeRoundIndex: i})}
                              vertical={true}
                        >
                            {
                                roundIterator.map((_, j) => this.renderGroupRound(i, j))
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
        const {lang, props: {submitable, params: {groupPPs, groupSize}, setParams}} = this,
            {playerPPs} = groupPPs[groupIndex].roundPPs[roundIndex]
        return <table key={`${groupIndex}-${roundIndex}`} className={style.privatePriceTable}>
            <tbody>
            <tr>
                <td>{lang.privatePrice}</td>
                {

                    Array(groupSize).fill(null).map((_, c) => <td key={c}>{lang.good}{c + 1}</td>)
                }
            </tr>
            {
                Array(groupSize).fill(null).map((_, r) => <tr key={r}>
                    <td>{lang.player}{r + 1}</td>
                    {
                        Array(groupSize).fill(null).map((_, c) => {
                            const value = playerPPs[r].privatePrices[c]
                            return <td key={c} className={submitable ? style.readonly : null}>
                                <Input value={value}
                                       onChange={({target: {value}}) => {
                                           if (submitable) {
                                               return
                                           }
                                           const _groupPPs = cloneDeep(groupPPs)
                                           _groupPPs[groupIndex].roundPPs[roundIndex].playerPPs[r].privatePrices[c] = value as any
                                           setParams({groupPPs: _groupPPs})
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
