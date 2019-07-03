import * as React from 'react'
import * as style from './style.scss'
import {Core} from '@bespoke/client-sdk'
import {Lang, Toast} from 'elf-component'

import {
    CONFIG,
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
import {Button, Input, Line, Modal, Tabs} from 'bespoke-game-stock-trading-component'

function Border({background = `radial-gradient(at 50% 0%, #67e968 1rem, transparent 70%)`, borderRadius = '1rem', children, style}: {
    background?: string,
    borderRadius?: string,
    style?: React.CSSProperties
    children: React.ReactNode,
}) {
    return <div style={{
        margin: '2px',
        padding: '1px',
        background,
        borderRadius,
        ...style
    }}>
        <div style={{
            borderRadius,
            background: '#2a3564',
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

function Result({periodIndex, count, point, closingPrice, balancePrice}: { periodIndex: number, count: number, point: number, closingPrice?: number, balancePrice?: number }) {
    const lang = Lang.extractLang({
        news: [`据财经网新闻，该企业发布财报后，股价受到相应影响，现股价为${balancePrice}元`],
        result: [`当前第${periodIndex + 1}期您的交易结果如下`, 'Your results in this period are as follows'],
        stockPrice: ['股价', 'Stock Price'],
        stock: ['持有股票', 'Stock'],
        money: ['资金', 'Money'],
        totalAsset: ['总资产', 'TotalAsset'],
        tips: ['连续竞价知识扩展', 'Tips about Continuous Double Auction'],
        close: ['关闭', 'Close'],
        tipsContent: ['连续竞价是指买卖股票时，由电脑交易系统连续撮合买卖委托，产生出成交价的一种交易机制。沪深两市上午连续竞价时间一致：09：30~11：30。但是下午就略有不同了，沪市：13：00~15：00，深市13：00~14：57。\n' +
        '连续竞价时，电脑系统会先按价格优先，再时间优先的顺序，依次为买卖委托单排队，并根据排队顺序依次撮合成交。所有超过限制价格的买单和卖单会被视为无效委托。连续竞价体现了股市公平公开公正的交易原则。\n' +
        '连续竞价时，成交价格的确定原则为:1、最高买入申报和最低卖出申报价格相同，以该价格成交; 2、买入申报价格高于即时揭示的最低卖出申报价格时，以即时揭示的最低卖出申报价格为成交价格; 3、卖出申报价格低于即时揭示的最高申报买入价格时，以即时揭示的最高申报买入价格为成交价。\n']
    })
    const [showTips, setShowTips] = React.useState(false)
    return <section className={style.result}>
        {
            balancePrice ? <p className={style.resultTitle}>{lang.news}</p> : null
        }
        <p className={style.resultTitle}>{lang.result}</p>
        <table className={style.resultTable}>
            <thead>
            <tr>
                <td>{lang.stockPrice}</td>
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
        <div className={style.tips}>
            <Button label={lang.tips} onClick={() => setShowTips(true)}/>
            <Modal visible={showTips}>
                <h3 className={style.tipsTitle}>{lang.tips}</h3>
                <div className={style.tipsContent}>
                    {
                        lang.tipsContent.split('\n').map(p => <p key={p}>{p}</p>)
                    }
                    <Button color={Button.Color.Blue} style={{margin: '1rem'}} label={lang.close}
                            onClick={() => setShowTips(false)}/>
                </div>
            </Modal>
        </div>
    </section>
}

type TPlayProps = Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>

function _Play({gameState, playerState, frameEmitter, game: {params: {allowLeverage}}}: TPlayProps) {
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
        guaranteeCount: ['已融券', 'GuaranteeCount'],
        guaranteeCountLimit: ['可融券', 'GuaranteeCountLimit'],
        guaranteeMoney: ['已融资', 'GuaranteeMoney'],
        guaranteeMoneyLimit: ['可融资', 'GuaranteeMoneyLimit'],
        profit: ['利润', 'Profit'],
        tradeType: ['交易类型', 'Trade Type'],
        tradeCount: ['成交数量', 'Trade Count'],
        valuation: ['当前股票估值', 'Stock Valuation'],
        timeLeft: [(n, s) => `第${n}期，剩余${s}秒`, (n, s) => `Period : ${n}, time left : ${s}s`],
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
        onceMore: ['再学一次', 'Once More'],
        nextPhase: ['返回交易大厅', 'Back to Lobby'],
        priceCountTips: ['价格 * 数量 ：', 'price * count : '],
        closeOutWarning: ['资产低于担保金额130%将被平仓', 'Your count will be closed out when assets is below 130% of guarantee money'],
        closedOut: ['资产低于担保金额130%，已被平仓', 'Your count has been closed out since assets is below 130% of guarantee money'],
        tradeSuccess: [count => `交易成功 , 数量 : ${count}`, count => `Trade success, count : ${count}`]
    })
    const {prepareTime, tradeTime, resultTime} = CONFIG
    const [countDown, setCountDown] = React.useState(0)
    const [moneyRepay, setMoneyRepay] = React.useState('' as number | string)
    const [countRepay, setCountRepay] = React.useState('' as number | string)
    const [price, setPrice] = React.useState('' as number | string)
    const [count, setCount] = React.useState('' as number | string)
    const [showChartModal, setShowChartModal] = React.useState(false)
    const [orderTabIndex, setOrderTabIndex] = React.useState(0)
    React.useEffect(() => {
        frameEmitter.on(PushType.countDown, ({countDown}) => setCountDown(countDown))
        frameEmitter.on(PushType.closeOutWarning, () => Toast.warn(lang.closeOutWarning))
        frameEmitter.on(PushType.closeOut, () => Toast.warn(lang.closedOut))
        frameEmitter.on(PushType.tradeSuccess, ({tradeCount}) => Toast.success(lang.tradeSuccess(tradeCount)))
        frameEmitter.emit(MoveType.getIndex)
    }, [])
    const gamePeriodState = gameState.periods[gameState.periodIndex]
    const {buyOrderIds, sellOrderIds, trades} = gamePeriodState,
        orderDict: { [id: number]: IOrder } = (() => {
            const orderDict: { [id: number]: IOrder } = {}
            gamePeriodState.orders.forEach(order => {
                orderDict[order.id] = order
            })
            return orderDict
        })()
    if (gamePeriodState.stage === PeriodStage.result) {
        return <section className={style.resultWrapper}>
            <Result periodIndex={gameState.periodIndex}
                    count={playerState.count}
                    point={playerState.money}
                    closingPrice={gamePeriodState.closingPrice}
                    balancePrice={gamePeriodState.balancePrice}/>
            {
                renderTradePanel()
            }
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
    const guaranteeMoneyLimit = nonNegative(playerState.money - playerState.guaranteeMoney),
        guaranteeCountLimit = nonNegative(~~(playerState.money / gamePeriodState.closingPrice) + playerState.count - playerState.guaranteeCount)
    return <section className={style.trading}>
        <div className={style.tradePanel}>
            {
                renderAsset()
            }
            {
                renderTradePanel()
            }
        </div>
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
        let countInvalid = false
        if (guarantee) {
            countInvalid = count <= 0 || (role === ROLE.Buyer && _price * +count > guaranteeMoneyLimit) ||
                (role === ROLE.Seller && count > guaranteeCountLimit)
        } else {
            countInvalid = count <= 0 || (role === ROLE.Buyer && _price * +count > playerState.money) ||
                (role === ROLE.Seller && count > playerState.count)
        }
        if (countInvalid) {
            setCount(0)
            return Toast.warn(lang.invalidCount)
        }
        frameEmitter.emit(MoveType.submitOrder, {
            price: _price,
            count: +count,
            role,
            guarantee
        })
        setCount('')
    }

    function repayMoney() {
        if (moneyRepay <= 0 || moneyRepay > playerState.money || moneyRepay > playerState.guaranteeMoney) {
            Toast.warn(lang.invalidMoney)
            return
        }
        frameEmitter.emit(MoveType.repayMoney, {moneyRepay: +moneyRepay})
    }

    function repayCount() {
        if (countRepay <= 0 || countRepay > playerState.count || countRepay > playerState.guaranteeCount) {
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
                                    <label className={style.subLabel}>
                                        {lang.timeLeft(gameState.periodIndex + 1, countDown < prepareTime ? '' : timeLeft > 0 ? timeLeft : 0)}</label>
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
                                                {
                                                    allowLeverage ? <Button {...{
                                                        label: lang.guaranteeBuy,
                                                        onClick: () => submitOrder(ROLE.Buyer, true)
                                                    }}/> : null
                                                }
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
                                                {
                                                    allowLeverage ? <Button {...{
                                                        label: lang.guaranteeSell,
                                                        onClick: () => submitOrder(ROLE.Seller, true)
                                                    }}/> : null
                                                }
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
                {
                    allowLeverage ? <>
                        <div>
                            <label>{lang.guaranteeCount}</label>
                            <em>{playerState.guaranteeCount}</em>
                        </div>
                        <div>
                            <label>{lang.guaranteeMoney}</label>
                            <em>{playerState.guaranteeMoney}</em>
                        </div>
                        <div>
                            <label>{lang.guaranteeCountLimit}</label>
                            <em>{guaranteeCountLimit}</em>
                        </div>
                        <div>
                            <label>{lang.guaranteeMoneyLimit}</label>
                            <em>{guaranteeMoneyLimit}</em>
                        </div>
                    </> : null
                }
            </div>
            {
                allowLeverage ? <>
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
                </> : null
            }
        </section>
    }

    function renderTradePanel() {
        return <>
            <Line text={lang.yourTrades} style={STYLE.titleLineStyle}/>
            <Border background={STYLE.mainPanelBorder} style={{maxWidth: '24rem', margin: 'auto'}}>
                <div className={style.tradeListWrapper}>
                    <table className={style.tradeList}>
                        <thead>
                        <tr>
                            <th>{lang.tradeSeq}</th>
                            <th>{lang.tradePrice}</th>
                            <th>{lang.tradeType}</th>
                            <th>{lang.tradeCount}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            trades.map(({reqOrderId, resOrderId, count}, i) => {
                                const reqOrder = orderDict[reqOrderId],
                                    resOrder = orderDict[resOrderId]
                                let myOrder: IOrder
                                switch (playerState.playerIndex) {
                                    case reqOrder.playerIndex:
                                        myOrder = reqOrder
                                        break
                                    case resOrder.playerIndex:
                                        myOrder = resOrder
                                        break
                                    default:
                                        return null
                                }
                                return <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{reqOrder.price}</td>
                                    <td>{myOrder.role === ROLE.Seller ? lang.sell : lang.buy}</td>
                                    <td>{count}</td>
                                </tr>
                            }).reverse()
                        }
                        </tbody>
                    </table>
                </div>
            </Border>
        </>
    }

    function renderChartPanel() {
        const chart = <div className={style.marketHistory} onClick={() => setShowChartModal(!showChartModal)}>
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
        return <div className={style.marketHistoryWrapper}>
            <Line text={lang.marketHistory} style={STYLE.titleLineStyle}/>
            <Border background={STYLE.mainPanelBorder}>
                {
                    chart
                }
                <Modal visible={showChartModal}>
                    {
                        chart
                    }
                </Modal>
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
                    marketOrderIds.map(orderId => {
                            const orderX = orderDict[orderId],
                                isMine = orderX.playerIndex === playerState.playerIndex
                            return <tr key={orderId} className={style.orderPrice}>
                                <td>{orderX.price}</td>
                                <td className={style.count}>{orderX.count}</td>
                                <td>
                                    <a className={style.btnCancel}
                                       style={{visibility: isMine ? 'visible' : 'hidden'}}
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

function nonNegative(n: number) {
    return n < 0 ? 0 : n
}