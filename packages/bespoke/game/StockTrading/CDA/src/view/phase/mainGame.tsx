import * as React from 'react'
import * as style from './style.scss'
import {Button, ButtonProps, Label, Lang, MaskLoading, RangeInput, Toast} from 'bespoke-client-util'
import {BasePhase} from './BasePhase'
import {CreateParams, GameState} from '../../interface'

import {MarketStage, MoveType, phaseNames, PushType, ROLE} from '../../config'
import {getEnumKeys} from '../../util'

export function UnitList({
                             unitList, editable, onChange = (...args) => {
    }
                         }) {
    return <section className={style.unitList}>
        <input {...{
            className: editable ? style.editable : '',
            value: unitList,
            onChange: (({target: {value}}) => onChange(value))
        }}/>
    </section>
}

class Create extends BasePhase.Create {
    lang = Lang.extractLang({
        [ROLE[ROLE.Seller]]: ['卖家', 'Seller'],
        [ROLE[ROLE.Buyer]]: ['买家', 'Buyer'],
        Role: ['角色', 'Role'],
        UnitList: ['输入序列', 'Input Sequences'],
        durationOfEachPeriod: ['时期时长', 'Duration of a period'],
        time2ReadInfo: ['浏览信息时长', 'Time to read game info'],
        invalidInputSequences: ['输入序列有误', 'Invalid input sequences']
    })

    get marketPositions(): Array<ROLE> {
        const phase = this.props.phases.find(({templateName}) => templateName === phaseNames.assignPosition)
        return phase ? phase.params.roles : []
    }

    checkParams({params}) {
        if (!params.unitLists.length) {
            Toast.warn(this.lang.invalidInputSequences)
            return false
        }
        return true
    }

    render() {
        const {lang, props: {params, updateParams}} = this
        return <section className={`${style.mainGame} ${style.createContent}`}>
            <ul className={style.baseFields}>
                {
                    Object.entries({
                        time2ReadInfo: {
                            min: 10,
                            max: 30,
                            step: 1
                        },
                        durationOfEachPeriod: {
                            min: 60,
                            max: 300,
                            step: 30
                        }
                    }).map(([key, props]) =>
                        <li key={key}>
                            <Label label={lang[key]}/>
                            <RangeInput {...props} {...{
                                value: params[key],
                                onChange: ({target: {value}}) => updateParams({[key]: +value})
                            }}/>
                        </li>)
                }
            </ul>
            <table className={style.positions}>
                <tbody>
                <tr>
                    <th>&nbsp;</th>
                    <th>{lang.Role}</th>
                    <th>{lang.UnitList}</th>
                </tr>
                {
                    this.marketPositions.map((role, positionIndex) =>
                        <tr key={positionIndex}>
                            <th>{positionIndex + 1}</th>
                            <td>{lang[ROLE[role]]}</td>
                            <td className={style.unitListWrapper}>
                                <UnitList {...{
                                    unitList: params.unitLists[positionIndex],
                                    editable: true,
                                    onChange: newUnitList => {
                                        const unitLists = params.unitLists.slice()
                                        unitLists[positionIndex] = newUnitList.replace(/[^*\s0-9]/g, '').replace(/\s+/g, ' ')
                                        updateParams({unitLists})
                                    }
                                }}/>
                            </td>
                        </tr>)
                }
                </tbody>
            </table>
        </section>
    }
}

class Info extends Create {
    render() {
        const {lang, props: {params}} = this
        return <section className={`${style.mainGame} ${style.createContent}`}>
            <ul className={style.baseFields}>
                {
                    ['durationOfEachPeriod', 'time2ReadInfo'].map(key =>
                        <li key={key}>
                            <Label label={lang[key]}/>
                            <a>{params[key]}</a>
                        </li>
                    )
                }
            </ul>
            <table className={style.positions}>
                <tbody>
                <tr>
                    <th>&nbsp;</th>
                    <th>{lang.Role}</th>
                    <th>{lang.UnitList}</th>
                </tr>
                {
                    this.marketPositions.map((role, positionIndex) =>
                        <tr key={positionIndex}>
                            <th>{positionIndex + 1}</th>
                            <td>
                                <div className={style.roleSwitcher}>
                                    {
                                        getEnumKeys(ROLE).map(key =>
                                            <a key={key}
                                               className={ROLE[key] === role ? style.active : ''}>{lang[key]}</a>
                                        )
                                    }
                                </div>
                            </td>
                            <td className={style.unitListWrapper}>
                                <UnitList {...{
                                    unitList: params.unitLists[positionIndex],
                                    editable: false
                                }}/>
                            </td>
                        </tr>)
                }
                </tbody>
            </table>
        </section>
    }
}

interface IPlayState {
    input: {
        price: number
    }
    timer: number
}

class Play extends BasePhase.Play<IPlayState> {
    lang = Lang.extractLang({
        period: ['时期', 'Period'],
        role: ['角色', 'Your Role'],
        timeLeft: ['剩余时间', 'Time Left'],
        profit: ['物品利润', 'Box Profit'],
        totalProfit: ['市场总利润', 'Total profit in the market'],
        currentProfit: ['本期总利润', 'Profit in current period'],
        unitNumber: ['物品序号', 'Unit Number'],
        unitCost: ['物品成本', 'Unit Cost'],
        unitValue: ['物品价值', 'Unit Value'],
        wait4MarketOpen: ['等待市场开放', 'Waiting for market opening'],
        marketWillOpen1: ['市场将在', 'Market will open in '],
        marketWillOpen2: [() => '秒后开放', n => `second${n > 1 ? 's' : ''}`],
        shout: ['报价', 'Shout'],
        cancel: ['撤回', 'Cancel'],
        toEnterNextPhase1: ['您在本期交易了', 'You traded'],
        toEnterNextPhase2: ['单位虚拟物品，共获得', ' goods in this period, and earned'],
        toEnterNextPhase3: ['实验币的利润。', ' experimental currency. You will enters the next page in'],
        toEnterNextPhase4: ['秒后将进入下一实验页面', ' seconds'],
        [ROLE[ROLE.Buyer]]: ['买家', 'Buyer'],
        [ROLE[ROLE.Seller]]: ['卖家', 'Seller'],
        noPosition: ['未分配到市场角色', 'You got no market position'],
        tradeCost: ['物品成本', 'Cost'],
        tradeValue: ['物品价值', 'Value'],
        tradePrice: ['成交价格', 'Price'],
        invalidBuyPrice: ['订单价格需在市场最高买价与当前物品价值之间', 'Order price must be between your private value and the highest buy price in the market'],
        invalidSellPrice: ['订单价格需在当前物品成本与市场最低卖价之间', 'Order price must be between the lowest buy price in the market and your private cost'],
        sellOrders: ['卖家订单', 'SellOrders'],
        buyOrders: ['买家订单', 'BuyOrders']
    })

    state: IPlayState = {

        input: {
            price: 0
        },
        timer: 0
    }

    componentDidMount(): void {
        const {frameEmitter} = this.props
        frameEmitter.on(PushType.periodCountDown, ({periodCountDown}) => {
            this.setState({timer: periodCountDown})
        })
    }

    submitOrder() {
        const {
            lang, props: {
                game, frameEmitter,
                gameState: {orders, phases: gameStatePhases, gamePhaseIndex},
                playerState: {positionIndex, unitLists}
            },
            state: {input}
        } = this
        const price = Number(input.price || 0)
        const orderDict: { [id: number]: GameState.IOrder } = {}
        orders.forEach(order => {
            orderDict[order.id] = order
        })
        const {buyOrderIds, sellOrderIds, positionUnitIndex} = gameStatePhases[gamePhaseIndex]
        const role = game.params.phases[0].params[positionIndex]
        const privateCost = Number(unitLists[gamePhaseIndex].split(' ')[positionUnitIndex[positionIndex]]),
            minSellOrder = orderDict[sellOrderIds[0]],
            maxBuyOrder = orderDict[buyOrderIds[0]]
        if (!privateCost) {
            return
        }
        if (role === ROLE.Seller && (price < privateCost || (minSellOrder && price >= minSellOrder.price))) {
            frameEmitter.emit(MoveType.rejectOrder, {price})
            return Toast.warn(lang.invalidSellPrice)
        }
        if (role === ROLE.Buyer && (price > privateCost || (maxBuyOrder && price <= maxBuyOrder.price))) {
            frameEmitter.emit(MoveType.rejectOrder, {price})
            return Toast.warn(lang.invalidSellPrice)
        }
        frameEmitter.emit(MoveType.submitOrder, {
            gamePhaseIndex,
            unitIndex: positionUnitIndex[positionIndex],
            price
        })
    }

    render() {
        const {
            lang, props: {
                game,
                gameState: {orders, phases: gameStatePhases, gamePhaseIndex},
                playerState: {positionIndex, unitLists, phases: playerStatePhases}
            }, state: {input, timer}
        } = this
        if (positionIndex === undefined) {
            return <MaskLoading label={lang.noPosition}/>
        }
        const orderDict: { [id: number]: GameState.IOrder } = {}
        orders.forEach(order => {
            orderDict[order.id] = order
        })
        const role = game.params.phases[0].params.roles[positionIndex],
            {time2ReadInfo, durationOfEachPeriod} = game.params.phases[gamePhaseIndex].params
        const {marketStage, buyOrderIds, sellOrderIds, trades, positionUnitIndex} = gameStatePhases[gamePhaseIndex],
            timeLeft = durationOfEachPeriod + time2ReadInfo - timer,
            time2NextPhase = durationOfEachPeriod + 2 * time2ReadInfo - timer
        const unitIndex = positionUnitIndex[positionIndex],
            unitPrice = +(unitLists[gamePhaseIndex].split(' ')[unitIndex] || 0)
        const [tradeCount, profit, tradeListFragment] = this.renderTradeList(orderDict, trades)
        return <section className={`${style.mainGame} ${style.playContent}`}>
            <ul className={style.header}>
                <li>{lang.period} : <em>{gamePhaseIndex}/{game.params.phases.length - 2}</em></li>
                <li>{lang.role} : <em>{lang[ROLE[role]]}</em></li>
                <li>{lang.timeLeft} : <em>{timer < time2ReadInfo ? '   ' : timeLeft > 0 ? timeLeft : 0}</em>s</li>
            </ul>
            {
                marketStage === MarketStage.notOpen ? <MaskLoading label={lang.wait4MarketOpen}/> :
                    marketStage === MarketStage.result ?
                        <section className={style.result}>
                            <p>
                                {lang.toEnterNextPhase1}
                                <em>{tradeCount}</em>
                                {lang.toEnterNextPhase2}
                                <em>{profit}</em>
                                {lang.toEnterNextPhase3}
                                <em>{time2NextPhase}</em>
                                {lang.toEnterNextPhase4}
                            </p>
                        </section> :
                        <section className={style.body}>
                            <div className={style.personalPanel}>
                                <section className={style.personalInfo}>
                                    <h3 className={style.title}>{lang.personalInfo}</h3>
                                    <div className={style.infoText}>
                                        <ul>
                                            <li>{lang.totalProfit}<em>{playerStatePhases.map(({periodProfit = 0}) => periodProfit).reduce((m, n) => m + n, 0)}</em>
                                            </li>
                                            <li>{lang.currentProfit}<em>{profit}</em></li>
                                        </ul>
                                    </div>
                                </section>
                                <section className={style.yourTrades}>
                                    <h3 className={style.title}>{lang.yourTrades}</h3>
                                    <div className={style.tradeListWrapper}>
                                        {
                                            tradeListFragment
                                        }
                                    </div>
                                </section>
                            </div>
                            <div className={style.orderPanel}>
                                <section className={style.orderBook}>
                                    <h3 className={style.title}>{lang.orderBook}</h3>
                                    <div className={style.orderListWrapper}>
                                        {
                                            this.renderOrderList(orderDict, buyOrderIds, ROLE.Buyer)
                                        }
                                        {
                                            this.renderOrderList(orderDict, sellOrderIds, ROLE.Seller)
                                        }
                                    </div>
                                </section>
                                <section className={style.orderSubmission}>
                                    <h3 className={style.title}>{lang.currentAllocation}</h3>
                                    <ul className={style.curUnitInfo}>
                                        <li>
                                            <label>{lang.unitNumber}</label>
                                            <em>{unitIndex + 1}</em>
                                        </li>
                                        <li>
                                            <label>{role === ROLE.Buyer ? lang.unitValue : lang.unitCost}</label>
                                            <em>{unitPrice}</em>
                                        </li>
                                    </ul>
                                    {
                                        marketStage === MarketStage.readDescription && time2ReadInfo > timer ?
                                            <p className={style.marketWillOpen}>{lang.marketWillOpen1}
                                                <em>{time2ReadInfo - timer}</em> {(lang.marketWillOpen2 as Function)(time2ReadInfo - timer)}
                                            </p> :
                                            <section className={style.newOrder}>
                                                <div className={style.orderInputWrapper}>
                                                    <input {...{
                                                        autoFocus: true,
                                                        value: input.price || '',
                                                        onChange: (({target: {value: price}}) => this.setState({input: {price}} as any))
                                                    }}/>
                                                </div>
                                                <div className={style.submitBtnWrapper}>
                                                    <Button {...{
                                                        label: lang.shout,
                                                        type: ButtonProps.Type.primary,
                                                        width: ButtonProps.Width.medium,
                                                        onClick: () => this.submitOrder()
                                                    }}/>
                                                </div>
                                            </section>
                                    }
                                </section>
                            </div>
                            <div className={style.historyPanel}>
                                <div className={style.tradeHistory}>
                                    <h3 className={style.title}>{lang.tradeHistory}</h3>
                                    <div className={style.tradeChartWrapper}>
                                        <TradeChart
                                            tradeList={trades.map(({reqId}) => ({price: orderDict[reqId].price}))}/>
                                    </div>
                                </div>
                            </div>
                        </section>
            }
        </section>
    }

    renderOrderList(orderDict: { [id: number]: GameState.IOrder }, marketOrderIds: Array<number>, shoutRole) {
        const {lang, props: {frameEmitter, playerState: {positionIndex}}} = this
        return <table className={style.orderList}>
            <thead>
            <tr>
                <th colSpan={3}>{shoutRole === ROLE.Seller ? lang.sellOrders : lang.buyOrders}</th>
            </tr>
            </thead>
            <tbody>
            {
                marketOrderIds.map((orderId, i) => {
                        const orderX = orderDict[orderId],
                            isMine = orderX.positionIndex === positionIndex
                        return <tr key={i} className={isMine ? style.active : ''}>
                            <td>{orderX.price}</td>
                            <td className={style.btnCancelWrapper}>
                                {
                                    i && isMine ?
                                        <a className={style.btnCancel}
                                           onClick={() => frameEmitter.emit(MoveType.cancelOrder)}>Cancel</a> : null
                                }
                            </td>
                        </tr>
                    }
                )
            }
            </tbody>
        </table>
    }

    renderTradeList(orderDict: { [id: number]: GameState.IOrder }, trades: Array<GameState.GamePhaseState.ITrade>): [number, number, React.ReactNode] {
        const {
                lang, props: {
                    game,
                    gameState: {gamePhaseIndex},
                    playerState: {positionIndex, unitLists}
                }
            } = this,
            role = game.params.phases[0].params.roles[positionIndex]
        const unitPrices = unitLists[gamePhaseIndex].split(' ').map(price => +price)
        const myTrades: Array<{
            privateCost: number,
            price?: number
        }> = unitPrices.map(privateCost => ({privateCost}))
        trades.forEach(({resId, reqId}) => {
            const reqOrder = orderDict[reqId],
                resOrder = orderDict[resId]
            switch (positionIndex) {
                case reqOrder.positionIndex: {
                    myTrades[reqOrder.unitIndex].price = reqOrder.price
                    break
                }
                case resOrder.positionIndex: {
                    myTrades[resOrder.unitIndex].price = reqOrder.price
                    break
                }
            }
        })
        let profit = 0, tradeCount = 0
        myTrades.forEach(({price, privateCost}) => {
            profit += price ? (price - privateCost) * (role === ROLE.Seller ? 1 : -1) : 0
            price ? tradeCount++ : null
        })
        const fragment = <table className={style.tradeList}>
            <thead>
            <tr>
                <td>{lang.unit}</td>
                <td>{role === ROLE.Seller ? lang.tradePrice : lang.tradeValue}</td>
                <td>{role === ROLE.Seller ? lang.tradeCost : lang.tradePrice}</td>
                <td>{lang.profit}</td>
            </tr>
            </thead>
            <tbody>
            {
                myTrades.map(({price, privateCost}, i) => <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{role === ROLE.Seller ? price : privateCost}</td>
                    <td>{role === ROLE.Seller ? privateCost : price}</td>
                    <td>{price ? (price - privateCost) * (role === ROLE.Seller ? 1 : -1) : null}</td>
                </tr>)
            }
            </tbody>
        </table>
        return [tradeCount, Number(profit.toFixed(2)), fragment]
    }
}

export const TradeChart: React.SFC<{
    tradeList: Array<{
        price: number
    }>
}> = ({tradeList}) => {
    const COLOR = {
        line: '#999',
        point: '#E27B6A'
    }
    const cellSize = 10, fontSize = 8, padding = 2 * fontSize,
        minY = 100, maxY = 400,
        maxX = tradeList.length > 30 ? tradeList.length : 30
    const transX = x => padding + x * cellSize,
        transY = y => maxY + padding - y
    return <section>
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox={`0,0,${maxX * cellSize + 2 * padding},${maxY - minY + 2 * padding}`}>
            {
                Array(maxX + 1).fill('').map((_, i) =>
                    <React.Fragment key={i}>
                        <line {...{
                            stroke: COLOR.line,
                            strokeWidth: i % 5 === 0 ? .5 : .1,
                            x1: transX(i),
                            y1: transY(minY),
                            x2: transX(i),
                            y2: transY(maxY)
                        }}/>
                        {
                            i && i % 5 === 0 ?
                                <text {...{
                                    fontSize,
                                    fill: COLOR.line,
                                    x: transX(i - .5 * fontSize / cellSize),
                                    y: transY(minY - fontSize)
                                }}>{i}</text> : null
                        }
                    </React.Fragment>
                )
            }
            {
                Array(~~((maxY - minY) / cellSize) + 1).fill('').map((_, i) =>
                    <React.Fragment key={i}>
                        <line {...{
                            stroke: COLOR.line,
                            strokeWidth: i % 5 === 0 ? .5 : .1,
                            x1: transX(0),
                            y1: transY(minY + i * cellSize),
                            x2: transX(maxX),
                            y2: transY(minY + i * cellSize)
                        }}/>
                        {
                            i && i % 5 === 0 ?
                                <text {...{
                                    fontSize,
                                    fill: COLOR.line,
                                    x: transX(-2 * fontSize / cellSize),
                                    y: transY(minY + (i - .5 * fontSize / cellSize) * cellSize)
                                }}>{minY + i * cellSize}</text> : null
                        }
                    </React.Fragment>
                )
            }
            {
                tradeList.map(({price}, i) =>
                    <React.Fragment key={i}>
                        <circle {...{
                            fill: COLOR.point,
                            cx: transX(i + 1),
                            cy: transY(price),
                            r: 2
                        }}/>
                        {
                            i ? <line {...{
                                stroke: COLOR.point,
                                strokeWidth: .5,
                                x1: transX(i + 1),
                                y1: transY(price),
                                x2: transX(i),
                                y2: transY(tradeList[i - 1].price)
                            }}/> : null
                        }
                    </React.Fragment>
                )
            }
        </svg>
    </section>
}

export default {Create, Info, Play}
