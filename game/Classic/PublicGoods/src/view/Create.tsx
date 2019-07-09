import * as React from 'react'
import * as style from './style.scss'
import {Core} from '@bespoke/register'
import {Button, Input, Label, Lang, MaskLoading, RangeInput, Tabs, Toast} from '@elf/component'
import {ICreateParams, IGroupParams} from '../interface'
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
        min: 2,
        max: 8
    }
}

interface ICreateState {
    activeGroupIndex: number
    activeRoundIndex: number
    minInitialMoney: number
    maxInitialMoney: number
}

export class Create extends Core.Create<ICreateParams, ICreateState> {
    lang = Lang.extractLang({
        edit: ['编辑', 'EDIT'],
        done: ['完成', 'DONE'],
        group: ['组', 'Group'],
        groupIndex: [i => `第${i + 1}组`, i => `Group ${i + 1}`],
        groupSize: ['每组人数', 'GroupSize'],
        round: ['轮次', 'Round'],
        roundIndex: [i => `第${i + 1}轮`, i => `Round ${i + 1}`],
        initialMoney: ['初始资金', 'Initial Money'],
        minInitialMoney: ['最低初始资金', 'Min Initial Money'],
        maxInitialMoney: ['最高初始资金', 'Max Initial Money'],
        K: ['回报率', 'Return Rate'],
        generate: ['随机生成', 'Generate'],
        player: ['玩家', 'Player'],
        checkInitialMoneyPls: [
            (g, r, p) => `玩家心理价格有误，请检查：第${g + 1}组:第${r + 1}轮:玩家${p + 1}`,
            (g, r, p) => `Private prices of players are invalid, check them please : Group${g + 1}:Round${r + 1}:Player${p + 1}`
        ],
        checkKPls: [
            (g, r) => `回报率(K)有误，请检查：第${g + 1}组:第${r + 1}轮`,
            (g, r) => `Return rate K is invalid, check it please : Group${g + 1}:Round${r + 1}`
        ]
    })
    state: ICreateState = {
        activeGroupIndex: 0,
        activeRoundIndex: 0,
        minInitialMoney: 50,
        maxInitialMoney: 100
    }

    componentDidMount(): void {
        let defaultParams: ICreateParams = {
            group: RANGE.group.max,
            groupSize: RANGE.groupSize.max,
            round: RANGE.round.max
        }
        defaultParams.groupParams = this.geneGroupParams(defaultParams)
        this.props.setParams(defaultParams)
    }

    edit() {
        const {props: {setSubmitable}} = this
        setSubmitable(false)
    }

    done() {
        const {lang, props: {setSubmitable, params: {round, groupSize, group, groupParams}, setParams}} = this
        let invalidIndex: {
            groupIndex: number
            roundIndex: number
            playerIndex?: number
        } = null
        const _groupParams = Array(group).fill(null).map((_, groupIndex) => ({
            roundParams: Array(round).fill(null).map((_, roundIndex) => {
                    const {playerInitialMoney, K} = groupParams[groupIndex].roundParams[roundIndex]
                    if (isNaN(+K)) {
                        invalidIndex = {groupIndex, roundIndex}
                        return null
                    }
                    return {
                        playerInitialMoney: Array(groupSize).fill(null).map((_, playerIndex) => {
                            if (invalidIndex) {
                                return null
                            }
                            const price = +playerInitialMoney[playerIndex]
                            if (price <= 0 || isNaN(price)) {
                                invalidIndex = {groupIndex, roundIndex, playerIndex}
                                return null
                            }
                            return price
                        }),
                        K: +K
                    }
                }
            )
        }))
        if (invalidIndex) {
            const {groupIndex, roundIndex, playerIndex} = invalidIndex
            playerIndex === undefined ?
                Toast.warn(lang.checkKPls(groupIndex, roundIndex)) :
                Toast.warn(lang.checkInitialMoneyPls(groupIndex, roundIndex, playerIndex))
            return
        }
        setParams({groupParams: _groupParams})
        setSubmitable(true)
    }

    geneGroupParams({group, groupSize, round}: Partial<ICreateParams>): Array<IGroupParams> {
        const {state: {minInitialMoney, maxInitialMoney}} = this
        return Array(RANGE.group.max).fill(null).map((_, groupIndex) => ({
            roundParams: Array(RANGE.round.max).fill(null).map((_, roundIndex) => ({
                    playerInitialMoney: Array(RANGE.groupSize.max).fill(null).map((_, playerIndex) =>
                        groupIndex < group &&
                        roundIndex < round &&
                        playerIndex < groupSize ?
                            ~~(Math.random() * (maxInitialMoney - minInitialMoney)) + minInitialMoney : null
                    ),
                    K: 1 + (+Math.random().toFixed(1))
                })
            )
        }))
    }

    updatePrivatePrice() {
        const {params, setParams} = this.props
        const groupParams = this.geneGroupParams(params)
        setParams({groupParams})
    }

    renderBaseFields() {
        const {
            lang,
            props: {params: {group, groupSize, round}, setParams, submitable},
            state: {activeGroupIndex, activeRoundIndex, minInitialMoney, maxInitialMoney}
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
                <Label label={lang.minInitialMoney}/>
                <RangeInput value={minInitialMoney}
                            onChange={({target: {value}}) => {
                                this.setState({minInitialMoney: +value})
                                if (value > maxInitialMoney) {
                                    this.setState({maxInitialMoney: +value})
                                }
                            }}/>
            </li>
            <li>
                <Label label={lang.maxInitialMoney}/>
                <RangeInput value={maxInitialMoney}
                            onChange={({target: {value}}) => {
                                this.setState({maxInitialMoney: +value})
                                if (value < minInitialMoney) {
                                    this.setState({minInitialMoney: +value})
                                }
                            }}/>
            </li>
            <Button label={lang.generate}
                    onClick={async () => await this.updatePrivatePrice()}/>
        </ul>
    }

    render(): React.ReactNode {
        const {lang, props: {params: {group, round, groupParams}, submitable}, state: {activeGroupIndex, activeRoundIndex}} = this
        if (!groupParams) {
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
        const {lang, props: {submitable, params: {groupParams, groupSize}, setParams}} = this,
            {playerInitialMoney, K} = groupParams[groupIndex].roundParams[roundIndex]
        return <>
            <table key={`${groupIndex}-${roundIndex}`} className={style.privatePriceTable}>
                <tbody>
                <tr>
                    <td>{lang.player}</td>
                    {
                        Array(groupSize).fill(null).map((_, r) => <td>{r + 1}</td>)
                    }
                </tr>
                <tr>
                    <td>{lang.initialMoney}</td>
                    {
                        Array(groupSize).fill(null).map((_, r) => <td className={submitable ? style.readonly : null}>
                            <Input value={playerInitialMoney[r]}
                                   onChange={({target: {value}}) => {
                                       if (submitable) {
                                           return
                                       }
                                       const _groupParams = cloneDeep(groupParams)
                                       _groupParams[groupIndex].roundParams[roundIndex].playerInitialMoney[r] = value as any
                                       setParams({groupParams: _groupParams})
                                   }}

                            />
                        </td>)
                    }
                </tr>
                </tbody>
            </table>
            <div className={`${style.KWrapper} ${submitable ? style.readonly : null}`}>
                <Label label={lang.K}/>
                <Input value={K}
                       onChange={({target: {value}}) => {
                           if (submitable) {
                               return
                           }
                           const _groupParams = cloneDeep(groupParams)
                           _groupParams[groupIndex].roundParams[roundIndex].K = value as any
                           setParams({groupParams: _groupParams})
                       }}

                />
            </div>
        </>
    }
}
