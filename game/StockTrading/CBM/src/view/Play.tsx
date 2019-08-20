import * as React from 'react'
import * as style from './style.scss'
import {Core} from '@bespoke/client'
import {Lang, Toast} from '@elf/component'
import Joyride, {Step} from 'react-joyride'

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
    PlayerStatus,
    PushType,
    ROLE
} from '../config'
import {Button, Input, Line, Modal, Tabs} from '@bespoke-game/stock-trading-component'
import {Input as AntInput, Radio} from 'antd'

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

export function TradeChart({
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
        marketOrders: ['市场订单', 'Market Orders'],
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
        tradeSuccess: [count => `交易成功 , 数量 : ${count}`, count => `Trade success, count : ${count}`],
        confirm: ['确定', 'Confirm']
    })
    const {prepareTime, tradeTime, resultTime} = CONFIG
    const [countDown, setCountDown] = React.useState(0)
    const [moneyRepay, setMoneyRepay] = React.useState('' as number | string)
    const [countRepay, setCountRepay] = React.useState('' as number | string)
    const [price, setPrice] = React.useState('' as number | string)
    const [count, setCount] = React.useState('' as number | string)
    const [showChartModal, setShowChartModal] = React.useState(false)
    const [orderTabIndex, setOrderTabIndex] = React.useState(0)
    const [testIndex, setTestIndex] = React.useState(0)
    React.useEffect(() => {
        frameEmitter.on(PushType.countDown, ({countDown}) => setCountDown(countDown))
        frameEmitter.on(PushType.closeOutWarning, () => Toast.warn(lang.closeOutWarning))
        frameEmitter.on(PushType.closeOut, () => Toast.warn(lang.closedOut))
        frameEmitter.on(PushType.tradeSuccess, ({tradeCount}) => Toast.success(lang.tradeSuccess(tradeCount)))
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
    if (playerState.status === PlayerStatus.test && allowLeverage) {
        return <LeverageTest done={() => frameEmitter.emit(MoveType.getIndex)}/>
    }
    const guaranteeMoneyLimit = nonNegative(playerState.money - playerState.guaranteeMoney),
        guaranteeCountLimit = nonNegative(~~(playerState.money / gamePeriodState.closingPrice) + playerState.count - playerState.guaranteeCount)
    return <section className={style.trading}>
        {
            playerState.status === PlayerStatus.guide ?
                allowLeverage ? <LeverageGuide done={() => frameEmitter.emit(MoveType.guideDone)}/> :
                    <Guide done={() => frameEmitter.emit(MoveType.guideDone)}/> : null
        }
        <div className={style.tradePanel}>
            {
                renderAsset()
            }
            {
                renderTradePanel()
            }
        </div>
        {
            playerState.status === PlayerStatus.test ? testIndex === 0 ? <OrderPanelTest {...{
                label: {
                    title: `测试题 1`,
                    todo: '您现在为买家，现要以12元的价格买入1股的配额数量',
                    question: '挂在买家订单上面的最高买价是11，挂在卖家订单上面的最低卖价是12。在这个时候若同时出现了一个买入价格为13元的买价订单，则成交价格为',
                    answer: '买入申报价13元高于即时揭示的最低卖价12元，以最低申报卖价12元成交。'
                },
                targetPrice: 12,
                buyPrices: [11],
                sellPrices: [12],
                onDone: () => setTestIndex(testIndex + 1)
            }}/> : <OrderPanelTest {...{
                label: {
                    title: '测试题 2',
                    todo: '您现在为卖家，现要以10元的价格卖出1股的配额数量',
                    question: '挂在买家订单上面的最高买价是11，挂在卖家订单上面的最低卖价是12。在这个时候若同时出现了一个买入价格为10元的卖家订单，则成交价格为',
                    answer: '卖出申报价10元低于即时揭示的最低卖价12元，以最低申报卖价12元成交。'
                },
                targetPrice: 10,
                buyPrices: [11],
                sellPrices: [12],
                onDone: () => frameEmitter.emit(MoveType.getIndex)
            }}/> : renderOrderPanel()
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
        return <div className={style.orderPanel}>
            <Line text={lang.marketOrders} style={STYLE.titleLineStyle}/>
            <section className={style.orderBook}>
                {
                    renderOrderList(buyOrderIds.map(id => orderDict[id]), ROLE.Buyer)
                }
                {
                    renderOrderList(sellOrderIds.map(id => orderDict[id]), ROLE.Seller)
                }
            </section>
            {
                <section className={style.orderSubmission}>
                    {
                        gamePeriodState.stage === PeriodStage.trading || playerState.status === PlayerStatus.guide ?
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
    }

    function OrderPanelTest({label, targetPrice, buyPrices, sellPrices, onDone}: {
        label: {
            todo: string
            question: string
            answer: string,
            title: string
        },
        targetPrice: number,
        buyPrices: Array<number>,
        sellPrices: Array<number>,
        onDone: () => void
    }) {
        const [price, setPrice] = React.useState('' as React.ReactText)
        const [tradePrice, setTradePrice] = React.useState('' as React.ReactText)
        const [count, setCount] = React.useState('' as React.ReactText)
        const [showQuestion, setShowQuestion] = React.useState(false)
        const [showAnswer, setShowAnswer] = React.useState(false)
        return <div className={`${style.orderPanel} ${style.test}`}>
            <Line text={lang.marketOrders} style={STYLE.titleLineStyle}/>
            <section className={style.orderBook}>
                {
                    renderOrderList(buyPrices.map(price => ({
                        id: 0,
                        playerIndex: -1,
                        role: ROLE.Buyer,
                        price: price,
                        count: 1,
                        guarantee: false
                    })), ROLE.Buyer)
                }
                {
                    renderOrderList(sellPrices.map(price => ({
                        id: 0,
                        playerIndex: -1,
                        role: ROLE.Seller,
                        price: price,
                        count: 1,
                        guarantee: false
                    })), ROLE.Seller)
                }
            </section>
            <div className={style.testTitle}>
                {
                    label.title
                }
            </div>
            {
                showQuestion ?
                    <>
                        <div className={style.testLabel}>
                            {label.question}
                        </div>
                        <Input value={tradePrice} onChange={val => setTradePrice(val)}/>
                        <br/>
                        {
                            showAnswer ?
                                <div className={style.answer}>
                                    <em>{'解析'}</em><span>{label.answer}</span><br/><br/>
                                    <Button label={lang.confirm} onClick={() => onDone()}/>
                                </div> : <Button label={'OK'} onClick={() => setShowAnswer(true)}/>
                        }
                    </> : <>
                        <div className={style.testLabel}>{label.todo}</div>
                        <section className={style.orderSubmission}>
                            <Input {...{
                                value: price || '',
                                placeholder: lang.price,
                                onChange: v => setPrice(v),
                                onMinus: v => setPrice(v - 1),
                                onPlus: v => setPrice(v + 1)
                            }}/>
                            <br/>
                            <Input {...{
                                value: count || '',
                                placeholder: lang.count,
                                onChange: v => setCount(v),
                                onMinus: v => setCount(v - 1),
                                onPlus: v => setCount(v + 1)
                            }}/>
                            <br/>
                            <Button label={lang.shout} onClick={() => {
                                if (price == targetPrice && count == 1) {
                                    setShowQuestion(true)
                                }
                            }}/>
                        </section>
                    </>
            }

        </div>
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
                        <div className={style.repay}>
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
                        <div className={style.repay}>
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

    function renderOrderList(marketOrders: Array<IOrder>, shoutRole) {
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
                    marketOrders.map(order => {
                            const isMine = order.playerIndex === playerState.playerIndex
                            return <tr key={order.id} className={style.orderPrice}>
                                <td>{order.price}</td>
                                <td className={style.count}>{order.count}</td>
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

function Guide({done}: { done: () => void }) {
    const [stepIndex, setStepIndex] = React.useState(0)
    const lang = Lang.extractLang({
        gotIt: ['我知道了', 'I got it']
    })
    const stepProps: Partial<Step> = {
            styles: {
                spotlight: {
                    border: '2px dashed #71ff7b',
                    borderRadius: '1.5rem'
                }
            },
            disableBeacon: true,
            hideCloseButton: true
        },
        steps = [
            {
                target: `.${style.summary}`,
                content: '您可以在这里查看您资产组合中的股票数量和资金数目',
                ...stepProps
            },
            {
                target: `.${style.tradeListWrapper}`,
                content: '您可以在这里查看您的股票交易记录',
                ...stepProps
            },
            {
                target: `.${style.orderBook}`,
                content: '您可以在这里查看已经提交的买家报价和卖家报价。买单和卖单分别排队，买单以价格从高到低排列，卖单以价格从低到高排列。同价的，按进入系统的先后排列。系统按照顺序将排在前面的买单和卖单配对成交，即按“价格优先，同等价格下时间优先”的顺序依次成交在，直到不能成交为止，未成交的委托排队等待成交。',
                styles: {
                    tooltip: {
                        width: '50vw',
                        height: '50vh'
                    }
                },
                ...stepProps
            },
            {
                target: `.${style.subLabel}`,
                content: '您可以在这里查看当前的交易期数和剩余交易时间，您需在规定的时间内完成交易。',
                ...stepProps
            },
            {
                target: `.${style.orderInputWrapper}`,
                content: '您可以在这里提交您的卖单和卖单。买入申报价高于即时揭示最低卖价，以最低申报卖价成交；卖出申报价低于最高买入价，以最高买入价成交。两个委托如果不能全部成交，剩余的继续留在单上，等待下次成交。系统处理原则为价格优先和时间优先两个原则。',
                ...stepProps
            },
            {
                target: `.${style.marketHistory}`,
                content: '您可以在这里查看已经成交的股票的成交价格。',
                ...stepProps
            }
        ]
    return <>
        <ul className={style.guideProgress}>
            {
                steps.map((_, i) =>
                    <li key={i} className={i < stepIndex ? style.active : ''}><span
                        className={style.step}>{i + 1}</span></li>
                )
            }
        </ul>
        <Joyride
            callback={({action}) => {
                console.log(action)
                if (action == 'update') {
                    setStepIndex(stepIndex + 1)
                }
                if (action == 'reset') {
                    done()
                }
            }}
            continuous
            showProgress
            hideBackButton
            disableOverlayClose
            steps={steps}
            locale={{
                next: lang.gotIt,
                last: lang.gotIt
            }}
            styles={{
                options: {
                    arrowColor: 'rgba(30,39,82,.8)',
                    backgroundColor: 'rgba(30,39,82,.8)',
                    overlayColor: '#1d1d32',
                    primaryColor: '#13553e',
                    textColor: '#fff'
                }
            }}
        />
    </>
}

function LeverageGuide({done}: { done: () => void }) {
    const [stepIndex, setStepIndex] = React.useState(0)
    const lang = Lang.extractLang({
        gotIt: ['我知道了', 'I got it']
    })
    const stepProps: Partial<Step> = {
            styles: {
                spotlight: {
                    border: '2px dashed #71ff7b',
                    borderRadius: '1.5rem'
                }
            },
            disableBeacon: true,
            hideCloseButton: true
        },
        steps = [
            {
                target: `.${style.summary}`,
                content: '您可以在这里查看您资产组合中的股票数量和资金数量以及您融资融券数目',
                ...stepProps
            },
            {
                target: `.${style.repayWrapper}`,
                content: <div className={style.repayGuide}>
                    <p>您可以在这里偿还融资债务和融券债务</p>
                    <p>偿还融资债务的方法有下列两种：</p>
                    <p>1） 卖券还款。指通过信用证券账户申报卖券，结算时卖出证券所得资金直接划转至证券公司融资专用资金账户的一种还款方式；</p>
                    <p>2） 直接还款。指使用信用资金账户中的现金，直接偿还对证券公司融资负债的一种还款方式；</p>
                    <p>偿还融券债务的方法有下列两种：</p>
                    <p>1） 买券还券。指通过信用证券账户申报买券，结算时买入证券直接划转至证券公司融券专用证券账户的一种还券方式；</p>
                    <p>2） 直接还券。指使用信用证券账户中与其负债证券相同的证券申报还券，结算时期证券直接划转至证券公司融券专用证券账户的一种还券方式。</p>
                </div>,
                styles: {
                    tooltip: {
                        width: '32rem'
                    }
                }
            },
            {
                target: `.${style.tradeListWrapper}`,
                content: '您可以在这里查看您的股票交易记录',
                ...stepProps
            },
            {
                target: `.${style.orderBook}`,
                content: '您可以在这里查看已经提交的买家报价和卖家报价。买单和卖单分别排队，买单以价格从高到低排列，卖单以价格从低到高排列。同价的，按进入系统的先后排列。系统按照顺序将排在前面的买单和卖单配对成交，即按“价格优先，同等价格下时间优先”的顺序依次成交在，直到不能成交为止，未成交的委托排队等待成交。',
                styles: {
                    tooltip: {
                        width: '50vw',
                        height: '50vh'
                    }
                },
                ...stepProps
            },
            {
                target: `.${style.subLabel}`,
                content: '您可以在这里查看当前的交易期数和剩余交易时间，您需在规定的时间内完成交易。',
                ...stepProps
            },
            {
                target: `.${style.orderInputWrapper}`,
                content: '您可以在这里提交您的卖单和卖单。买入申报价高于即时揭示最低卖价，以最低申报卖价成交；卖出申报价低于最高买入价，以最高买入价成交。两个委托如果不能全部成交，剩余的继续留在单上，等待下次成交。系统处理原则为价格优先和时间优先两个原则。',
                ...stepProps
            },
            {
                target: `.${style.marketHistory}`,
                content: '您可以在这里查看已经成交的股票的成交价格。',
                ...stepProps
            }
        ]
    return <>
        <ul className={style.guideProgress}>
            {
                steps.map((_, i) =>
                    <li key={i} className={i < stepIndex ? style.active : ''}><span
                        className={style.step}>{i + 1}</span></li>
                )
            }
        </ul>
        <Joyride
            callback={({action}) => {
                console.log(action)
                if (action == 'update') {
                    setStepIndex(stepIndex + 1)
                }
                if (action == 'reset') {
                    done()
                }
            }}
            continuous
            showProgress
            hideBackButton
            disableOverlayClose
            steps={steps}
            locale={{
                next: lang.gotIt,
                last: lang.gotIt
            }}
            styles={{
                options: {
                    arrowColor: 'rgba(30,39,82,.8)',
                    backgroundColor: 'rgba(30,39,82,.8)',
                    overlayColor: '#1d1d32',
                    primaryColor: '#13553e',
                    textColor: '#fff'
                }
            }}
        />
    </>
}

function LeverageTest({done}: { done: () => void }) {
    const lang = Lang.extractLang({
        confirm: ['确定', 'CONFIRM']
    })
    const [choseA, setChoseA] = React.useState(0),
        [choseB, setChoseB] = React.useState(0),
        [choseC, setChoseC] = React.useState(0),
        [inputA, setInputA] = React.useState(''),
        [inputB, setInputB] = React.useState(''),
        [inputC, setInputC] = React.useState(''),
        [showAnswer, setShowAnswer] = React.useState(false)
    return <section className={style.leverageTest}>
        <div className={style.title}>{'知识点测试'}</div>
        <ul className={`${style.questions} ${showAnswer ? style.showAnswer : ''}`}>
            <li className={style.radioQuestion}>
                <p>1. 偿还融资债务的方法有_________；偿还融券债务的方法有____________。</p>
                <Radio.Group style={{margin: '.5rem'}} onChange={({target: {value}}) => setChoseA(+value)}
                             value={choseA}>
                    <Radio value={1}>A. 卖券还款和直接还款；买券还券和直接还券</Radio>
                    <Radio value={2}>B. 卖券还款；买券还券</Radio>
                    <Radio value={3}>C. 直接还款；直接还券</Radio>
                    <Radio value={4}>D. 卖券还款；直接还券</Radio>
                </Radio.Group>
                <p className={style.answer}>正确答案：A</p>
            </li>
            <li>
                <p>2.
                    挂在买家订单上面的最高买价是9.96，挂在卖家订单上面的最低卖价是9.98。在这个时候同时出现了一个买入价格为10元的买价订单和卖出价格为9.90元的卖家订单。则报价为10元的订单会以9.98成交，报价为9.90元的订单会以
                    <AntInput autosize={true} style={{width: '5rem', margin: '0 1rem'}} value={inputA}
                              onChange={({target: {value}}) => setInputA(value)}/>
                    成交。</p>
                <p className={style.answer}>正确答案：9.96</p>
            </li>
            <li>
                <p>3. 融资保证金比例不得低于
                    <AntInput autosize={true} style={{width: '5rem', margin: '0 1rem'}} value={inputB}
                              onChange={({target: {value}}) => setInputB(value)}/>
                    %，融券保证金比例不得低于
                    <AntInput autosize={true} style={{width: '5rem', margin: '0 1rem'}} value={inputC}
                              onChange={({target: {value}}) => setInputC(value)}/>
                    %</p>
                <p className={style.answer}>正确答案：50 , 50</p>
            </li>
            <li className={style.radioQuestion}>
                <p>4.
                    假设客户提交市值为100万元的股票A作为进行融资融券交易的担保物，折算率为70%，融资保证金比例为0.5.则客户可以融资买入的最大金额为____________万元。本例中客户的佣金及融资利息、融券费用均忽略不计。</p>
                <Radio.Group style={{margin: '.5rem'}} onChange={({target: {value}}) => setChoseB(+value)}
                             value={choseB}>
                    <Radio value={1}>A. 200</Radio>
                    <Radio value={2}>B. 50</Radio>
                    <Radio value={3}>C. 140</Radio>
                    <Radio value={4}>D. 70</Radio>
                </Radio.Group>
                <p className={style.answer}>解析：100*0.7*2=140万元，因此正确答案为C</p>
            </li>
            <li className={style.radioQuestion}>
                <p>5.
                    投资者信用账户内有60万元现金和100万元市值的某证券，假设该证券的折算率为60%，那么，该投资者信用账户内的保证金金额为____________万元。</p>
                <Radio.Group style={{margin: '.5rem'}} onChange={({target: {value}}) => setChoseC(+value)}
                             value={choseC}>
                    <Radio value={1}>A. 160</Radio>
                    <Radio value={2}>B. 136</Radio>
                    <Radio value={3}>C. 120</Radio>
                    <Radio value={4}>D. 100</Radio>
                </Radio.Group>
                <p className={style.answer}>解析：60+100*0.6=120，因此正确答案为C</p>
            </li>
        </ul>
        <Button label={lang.confirm} onClick={() => {
            if ([choseA,choseB,choseC,inputA,inputB,inputC].toString()===[1,3,3,'9.96','50','50'].toString()) {
                done()
            } else {
                setShowAnswer(true)
            }
        }}/>
    </section>
}