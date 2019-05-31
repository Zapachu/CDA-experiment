import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, Toast} from 'bespoke-client-util'

import {
    CONFIG,
    FetchType,
    ICreateParams,
    IGameState,
    IMoveParams,
    IOrder,
    IPlayerState,
    IPushParams,
    MoveType,
    PERIOD,
    PeriodStage,
    PushType,
    ROLE
} from '../config'
import {Button, Input, Line, Tabs} from 'bespoke-game-stock-trading-component'

function Border({background = `radial-gradient(at 50% 0%, #67e968 1rem, transparent 70%)`, borderRadius = '1rem', children, style}: {
    background?: string,
    borderRadius?: string,
    style?: React.CSSProperties
    children: React.ReactNode,
}) {
    return <div style={{
        padding: '1px',
        background,
        borderRadius,
        ...style
    }}>
        <div style={{
            borderRadius,
            overflow: 'hidden',
            height: '100%'
        }}>
            {children}
        </div>
    </div>
}

function TradeChart({
                        tradeList, color = {
        scalePlate: '#999',
        line: '#999',
        title: '#999',
        number: '#999',
        point: '#E27B6A'
    }
                    }: {
    tradeList: Array<{
        price: number,
        count: number
    }>,
    color?: {
        scalePlate: string
        point: string,
        line: string
        title: string,
        number: string
    }
}) {
    const cellSize = 5, fontSize = 12, padding = 2 * fontSize,
        minY = 0, maxY = 180,
        maxX = tradeList.length > 40 ? tradeList.length : 40
    const transX = x => padding + x * cellSize,
        transY = y => maxY + padding - y
    return <section>
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox={`0,0,${maxX * cellSize + 2 * padding},${maxY - minY + 2 * padding}`}>
            {
                Array(maxX + 1).fill('').map((_, i) =>
                    <React.Fragment key={i}>
                        <line {...{
                            stroke: color.scalePlate,
                            strokeWidth: i === 0 ? 1 : i % 5 === 0 ? .3 : .1,
                            x1: transX(i),
                            y1: transY(minY),
                            x2: transX(i),
                            y2: transY(maxY)
                        }}/>
                        {
                            i && i % 5 === 0 ?
                                <text {...{
                                    fontSize,
                                    fill: color.number,
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
                            stroke: color.scalePlate,
                            strokeWidth: i === 0 ? 1 : i % 5 === 0 ? .3 : .1,
                            x1: transX(0),
                            y1: transY(minY + i * cellSize),
                            x2: transX(maxX),
                            y2: transY(minY + i * cellSize)
                        }}/>
                        {
                            i && i % 5 === 0 ?
                                <text {...{
                                    fontSize,
                                    fill: color.number,
                                    x: transX(-2 * fontSize / cellSize),
                                    y: transY(minY + (i - .5 * fontSize / cellSize) * cellSize)
                                }}>{minY + i * cellSize}</text> : null
                        }
                    </React.Fragment>
                )
            }
            {
                tradeList.map(({price, count}, i) =>
                    <React.Fragment key={i}>
                        <circle {...{
                            fill: color.point,
                            cx: transX(i + 1),
                            cy: transY(price),
                            r: 2
                        }}/>
                        {
                            i ? <line {...{
                                stroke: color.point,
                                strokeWidth: 1,
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

function Result({count, point, closingPrice, balancePrice}: { count: number, point: number, closingPrice?: number, balancePrice?: number }) {
    const lang = Lang.extractLang({
        result: ['您本期交易结果如下', 'Your results in this period are as follows'],
        closingPrice: ['收盘价', 'Closing Price'],
        balancePrice: ['均衡价', 'Balance Price'],
        stock: ['股票', 'Stock'],
        money: ['资金', 'Money'],
        totalAsset: ['总资产', 'TotalAsset']
    })
    return <section className={style.result}>
        <p className={style.resultTitle}>{lang.result}</p>
        <table className={style.resultTable}>
            <thead>
            <tr>
                <td>{balancePrice ? lang.balancePrice : lang.closingPrice}</td>
                <td>{lang.stock}</td>
                <td>{lang.money}</td>
                <td>{lang.totalAsset}</td>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{balancePrice || closingPrice}</td>
                <td>{count}</td>
                <td>{point}</td>
                <td>{(balancePrice || closingPrice) * count + point}</td>
            </tr>
            </tbody>
        </table>
    </section>
}

type TPlayProps = Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>

function _Play({gameState, playerState, frameEmitter}: TPlayProps) {
    const STYLE = {
        titleLineStyle: {
            maxWidth: '24rem',
            fontSize: '1.2rem',
            margin: '2rem auto 1rem'
        },
        orderPanelTitle: {
            maxWidth: '12rem',
            fontSize: '1rem',
            margin: '1rem auto'
        },
        mainPanelBorder: `linear-gradient(#ddd, transparent)`
    }
    const lang = Lang.extractLang({
        price: ['价格', 'Price'],
        stock: ['股票', 'Stock'],
        count: ['数量', 'Count'],
        point: ['余额', 'Point'],
        money: ['金额', 'Money'],
        guaranteeCount: ['担保股票', 'GuaranteeCount'],
        guaranteeMoney: ['担保金额', 'GuaranteeMoney'],
        profit: ['利润', 'Profit'],
        tradeCount: ['成交数量', 'Trade Count'],
        valuation: ['当前股票估值', 'Stock Valuation'],
        buyCountLimit: ['可买入', 'You can buy'],
        openMarket: ['开放市场', 'Open Market'],
        marketWillOpen1: ['市场将在', 'Market will open in '],
        marketWillOpen2: [() => '秒后开放', n => `second${n > 1 ? 's' : ''}`],
        toNextPeriod1: ['市场将在', 'Market will begin next period in'],
        toNextPeriod2: ['秒后进入下一期', 'seconds'],
        shout: ['报价', 'Shout'],
        cancel: ['撤回', 'Cancel'],
        buy: ['买入', 'Buy'],
        sell: ['卖出', 'Sell'],
        repay: ['还款还券', 'Repay'],
        guaranteeBuy: ['担保买入', 'Guarantee Buy'],
        guaranteeSell: ['担保卖出', 'NGuarantee Sell'],
        repayMoney: ['还款', 'Repay Money'],
        repayStock: ['还券', 'Repay Stock'],
        tradeSeq: ['订单序号', 'Trade Number'],
        tradePrice: ['成交价格', 'Price'],
        invalidBuyPrice: ['订单价格需高于市场当前最高买价', 'Order price must be lower than the highest buy price in the market'],
        invalidSellPrice: ['订单价格需低于市场当前最低卖价', 'Order price must be higher than the lowest buy price in the market'],
        invalidCount: ['超出可交易物品数量', 'Exceed the number of tradable units'],
        invalidMoney: ['金额有误，请检查', 'Invalid Money'],
        sellOrders: ['卖家订单', 'SellOrders'],
        buyOrders: ['买家订单', 'BuyOrders'],
        yourTrades: ['交易记录', 'Your Trades'],
        marketHistory: ['市场记录', 'Market History'],
        asset: ['资产', 'Asset'],
        onceMore: ['再来一次', 'Once More'],
        nextPhase: ['下一环节', 'Next Phase'],
        priceCountTips: ['价格 * 数量 ：', 'price * count : ']
    })
    const {prepareTime, tradeTime, resultTime} = CONFIG
    const [countDown, setCountDown] = React.useState(0)
    const [moneyRepay, setMoneyRepay] = React.useState('' as number | string)
    const [countRepay, setCountRepay] = React.useState('' as number | string)
    const [price, setPrice] = React.useState('' as number | string)
    const [count, setCount] = React.useState('' as number | string)
    const [orderTabIndex, setOrderTabIndex] = React.useState(0)
    React.useEffect(() => {
        frameEmitter.on(PushType.countDown, ({countDown}) => setCountDown(countDown))
        frameEmitter.emit(MoveType.getIndex)
    }, [])
    const gamePeriodState = gameState.periods[gameState.periodIndex]
    if (gamePeriodState.stage === PeriodStage.result) {
        return <section className={style.resultWrapper}>
            <Result count={playerState.count}
                    point={playerState.money}
                    closingPrice={gamePeriodState.closingPrice}
                    balancePrice={gamePeriodState.balancePrice}/>
            {
                gameState.periodIndex === PERIOD - 1 ? <section className={style.switchBtns}>
                    <Button label={lang.onceMore}
                            onClick={() => exitGame(true)}/>&nbsp;
                    <Button label={lang.nextPhase} onClick={() => exitGame()}/>
                </section> : <p className={style.toNextPeriod}>
                    {lang.toNextPeriod1}
                    <em>{prepareTime + tradeTime + resultTime - countDown}</em>
                    {lang.toNextPeriod2}
                </p>
            }
        </section>
    }
    const {buyOrderIds, sellOrderIds, trades} = gamePeriodState,
        orderDict: { [id: number]: IOrder } = (() => {
            const orderDict: { [id: number]: IOrder } = {}
            gamePeriodState.orders.forEach(order => {
                orderDict[order.id] = order
            })
            return orderDict
        })()
    return <section className={style.trading}>
        {
            renderTradePanel()
        }
        {
            renderOrderPanel()
        }
        {
            renderChartPanel()
        }
    </section>

    function submitOrder(role: ROLE, guarantee?: boolean) {
        const _price = Number(price || 0)
        const minSellOrder = orderDict[sellOrderIds[0]],
            maxBuyOrder = orderDict[buyOrderIds[0]]
        if (role === ROLE.Seller && minSellOrder && _price > minSellOrder.price) {
            return Toast.warn(lang.invalidSellPrice)
        }
        if (role === ROLE.Buyer && maxBuyOrder && _price < maxBuyOrder.price) {
            return Toast.warn(lang.invalidBuyPrice)
        }
        if (count <= 0 ||
            (role === ROLE.Buyer && _price * +count > playerState.money - playerState.guaranteeMoney) ||
            (role === ROLE.Buyer && count > playerState.count - playerState.guaranteeCount)) {
            setCount(0)
            return Toast.warn(lang.invalidCount)
        }
        frameEmitter.emit(MoveType.submitOrder, {
            price: _price,
            count: +count,
            role,
            guarantee
        })
    }

    function repayMoney() {
        if (moneyRepay <= 0 || moneyRepay > playerState.money) {
            Toast.warn(lang.invalidMoney)
            return
        }
        frameEmitter.emit(MoveType.repayMoney, {moneyRepay: +moneyRepay})
    }

    function repayCount() {
        if (countRepay <= 0 || countRepay > playerState.count) {
            Toast.warn(lang.invalidCount)
            return
        }
        frameEmitter.emit(MoveType.repayCount, {countRepay: +countRepay})
    }

    function renderOrderPanel() {
        const timeLeft = tradeTime + prepareTime - countDown
        const privatePrice = playerState.privatePrices[gameState.periodIndex]
        const total = +price * +count
        const inputPrice = <Input {...{
            value: price || '',
            placeholder: lang.price,
            onChange: v => setPrice(v),
            onMinus: v => setPrice(v - 1),
            onPlus: v => setPrice(v + 1)
        }}/>, inputCount = <Input {...{
            value: count || '',
            placeholder: lang.count,
            onChange: v => setCount(v),
            onMinus: v => setCount(v - 1),
            onPlus: v => setCount(v + 1)
        }}/>, inputFragment = <>
            <label
                className={style.subLabel}>{lang.priceCountTips}{total && !isNaN(total) ? `${price}*${count}=${total}` : ''}</label>
            <br/>
            {inputPrice}
            <br/>
            {inputCount}
        </>
        return <Border style={{flexBasis: '40rem'}} background={STYLE.mainPanelBorder}>
            <div className={style.orderPanel}>
                <section className={style.orderBook}>
                    {
                        renderOrderList(buyOrderIds, ROLE.Buyer)
                    }
                    {
                        renderOrderList(sellOrderIds, ROLE.Seller)
                    }
                </section>
                {
                    <section className={style.orderSubmission}>
                        {
                            gamePeriodState.stage === PeriodStage.trading ?
                                <section className={style.newOrder}>
                                    <label
                                        className={style.subLabel}>{countDown < prepareTime ? '   ' : timeLeft > 0 ? timeLeft : 0}s</label>
                                    <label className={style.label}>{lang.valuation}<em>{privatePrice}</em></label>
                                    <Tabs labels={[lang.buy, lang.sell]}
                                          activeTabIndex={orderTabIndex} switchTab={setOrderTabIndex}>
                                        <div className={style.orderInputWrapper}>
                                            {
                                                inputFragment
                                            }
                                            <div className={style.submitBtnWrapper}>
                                                <Button {...{
                                                    label: lang.buy,
                                                    onClick: () => submitOrder(ROLE.Buyer)
                                                }}/>&nbsp;
                                                <Button {...{
                                                    label: lang.guaranteeBuy,
                                                    onClick: () => submitOrder(ROLE.Buyer, true)
                                                }}/>
                                            </div>
                                        </div>
                                        <div className={style.orderInputWrapper}>
                                            {
                                                inputFragment
                                            }
                                            <div className={style.submitBtnWrapper}>
                                                <Button {...{
                                                    label: lang.sell,
                                                    onClick: () => submitOrder(ROLE.Seller)
                                                }}/>&nbsp;
                                                <Button {...{
                                                    label: lang.guaranteeSell,
                                                    onClick: () => submitOrder(ROLE.Seller, true)
                                                }}/>
                                            </div>
                                        </div>
                                    </Tabs>
                                </section> : prepareTime > countDown ?
                                <p className={style.marketWillOpen}>{lang.marketWillOpen1}
                                    <em>{prepareTime - countDown}</em> {(lang.marketWillOpen2 as Function)(prepareTime - countDown)}
                                </p> : null
                        }
                    </section>
                }
            </div>
        </Border>
    }

    function renderAsset() {
        return <section className={style.asset}>
            <Line text={lang.asset} style={STYLE.titleLineStyle}/>
            <div className={style.summary}>
                <div>
                    <label>{lang.stock}</label>
                    <em>{playerState.count}</em>
                </div>
                <div>
                    <label>{lang.point}</label>
                    <em>{playerState.money}</em>
                </div>
                <div>
                    <label>{lang.guaranteeCount}</label>
                    <em>{playerState.guaranteeCount}</em>
                </div>
                <div>
                    <label>{lang.guaranteeMoney}</label>
                    <em>{playerState.guaranteeMoney}</em>
                </div>
            </div>
            <Line text={lang.repay} style={STYLE.titleLineStyle}/>
            <div className={style.repayWrapper}>
                <Input {...{
                    value: moneyRepay || '',
                    placeholder: lang.money,
                    onChange: v => setMoneyRepay(v),
                    onMinus: v => setMoneyRepay(v - 1),
                    onPlus: v => setMoneyRepay(v + 1)
                }}/>
                <br/>
                <Button {...{
                    label: lang.repayMoney,
                    onClick: () => repayMoney()
                }}/>
            </div>
            <div className={style.repayWrapper}>
                <Input {...{
                    value: countRepay || '',
                    placeholder: lang.count,
                    onChange: v => setCountRepay(v),
                    onMinus: v => setCountRepay(v - 1),
                    onPlus: v => setCountRepay(v + 1)
                }}/>
                <br/>
                <Button {...{
                    label: lang.repayStock,
                    onClick: () => repayCount()
                }}/>
            </div>
        </section>
    }

    function renderTradePanel() {
        let tradeCount = 0
        return <div className={style.tradePanel}>
            {
                renderAsset()
            }
            <Line text={lang.yourTrades} style={STYLE.titleLineStyle}/>
            <Border background={STYLE.mainPanelBorder} style={{margin: '1px'}}>
                <div className={style.yourTrades}>
                    <table className={style.tradeList}>
                        <thead>
                        <tr>
                            <th>{lang.tradeSeq}</th>
                            <th>{lang.tradePrice}</th>
                            <th>{lang.tradeCount}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            trades.map(({reqOrderId, resOrderId, count}, i) => {
                                const reqOrder = orderDict[reqOrderId],
                                    resOrder = orderDict[resOrderId]
                                if (![reqOrder.playerIndex, resOrder.playerIndex].includes(playerState.playerIndex)) {
                                    return null
                                }
                                const price = reqOrder.price
                                tradeCount += count
                                return <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{price}</td>
                                    <td>{count}</td>
                                </tr>
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </Border>
        </div>
    }

    function renderChartPanel() {
        return <div className={style.marketHistoryWrapper}>
            <Line text={lang.marketHistory} style={STYLE.titleLineStyle}/>
            <Border background={STYLE.mainPanelBorder}>
                <div className={style.marketHistory}>
                    <div style={{
                        margin: '1rem',
                        width: `${(~~(trades.length / 24) + 2) * 12}rem`
                    }}>
                        <TradeChart
                            tradeList={trades.map(({reqOrderId}) => {
                                const {price, count} = orderDict[reqOrderId]
                                return {price, count}
                            })}
                            color={{
                                scalePlate: '#fff',
                                line: '#f99460',
                                point: '#f99460',
                                title: '#aff85e',
                                number: '#f99460'
                            }}
                        />
                    </div>
                </div>
            </Border>
        </div>
    }

    function renderOrderList(marketOrderIds: Array<number>, shoutRole) {
        return <section className={style.orderList}>
            <Line text={shoutRole === ROLE.Seller ? lang.sellOrders : lang.buyOrders} style={STYLE.orderPanelTitle}/>
            <table className={style.orderTable}>
                <thead>
                <tr>
                    <th>{lang.price}</th>
                    <th>{lang.count}</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {
                    marketOrderIds.map((orderId, i) => {
                            const orderX = orderDict[orderId],
                                isMine = orderX.playerIndex === playerState.playerIndex
                            return <tr key={orderId} className={style.orderPrice}>
                                <td>{orderX.price}</td>
                                <td className={style.count}>{orderX.count}</td>
                                <td>
                                    <a className={style.btnCancel}
                                       style={{visibility: i && isMine ? 'visible' : 'hidden'}}
                                       onClick={() => frameEmitter.emit(MoveType.cancelOrder)}>×</a>
                                </td>
                            </tr>
                        }
                    )
                }
                </tbody>
            </table>
        </section>
    }

    function exitGame(onceMore?: boolean) {
        frameEmitter.emit(MoveType.exitGame, {onceMore}, lobbyUrl => location.href = lobbyUrl)
    }
}

export function Play(props: TPlayProps) {
    return <section className={style.play}>
        <_Play {...props}/>
    </section>
}