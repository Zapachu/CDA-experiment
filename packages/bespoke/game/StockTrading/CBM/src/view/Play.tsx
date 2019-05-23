import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, Toast} from 'bespoke-client-util'
import {
    FetchType,
    GameStage,
    ICreateParams,
    IGameState,
    IMoveParams,
    IOrder,
    IPlayerState,
    IPushParams,
    MATCH_TIME,
    MoveType,
    PeriodStage,
    PushType,
    ROLE,
    CONFIG
} from '../config'
import {Button, Input, Line, MatchModal, PlayMode} from '../../../components'

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
    const cellSize = 10, fontSize = 12, padding = 2 * fontSize,
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

function Result({count, point}: { count: number, point: number }) {
    const lang = Lang.extractLang({
        toEnterNextPhase1: ['您当前持有股票', 'You have'],
        toEnterNextPhase2: ['，资金', ' stocks, and '],
        toEnterNextPhase3: ['', ' experimental currency'],
        onceAgain: ['再来一次', 'Once Again'],
        nextPhase: ['下一环节', 'Next Phase']
    })
    return <section className={style.result}>
        <p>
            {lang.toEnterNextPhase1}
            <em>{count}</em>
            {lang.toEnterNextPhase2}
            <em>{point}</em>
            {lang.toEnterNextPhase3}
        </p>
        <div className={style.switchBtns}>
        </div>
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
        mainPanelBorder: `linear-gradient(#ddd, transparent)`
    }
    const lang = Lang.extractLang({
        price: ['价格', 'Price'],
        count: ['数量', 'Count'],
        point: ['余额', 'Point'],
        profit: ['利润', 'Profit'],
        tradeCount: ['成交数量', 'Trade Count'],
        buyCountLimit: ['可买入', 'You can buy'],
        sellCountLimit: ['已持有', 'You are holding'],
        shout4UnitPls: ['请为当前物品报价：价格 * 数量', 'Shout for this unit please : price * count'],
        openMarket: ['开放市场', 'Open Market'],
        marketWillOpen1: ['市场将在', 'Market will open in '],
        marketWillOpen2: [() => '秒后开放', n => `second${n > 1 ? 's' : ''}`],
        shout: ['报价', 'Shout'],
        cancel: ['撤回', 'Cancel'],
        Buy: ['买入', 'Buy'],
        Sell: ['卖出', 'Sell'],
        tradeSeq: ['订单序号', 'Trade Number'],
        tradePrice: ['成交价格', 'Price'],
        invalidBuyPrice: ['订单价格需在市场最高买价与当前物品价值之间', 'Order price must be between your private value and the highest buy price in the market'],
        invalidSellPrice: ['订单价格需在当前物品成本与市场最低卖价之间', 'Order price must be between the lowest buy price in the market and your private cost'],
        invalidCount: ['超出可交易物品数量', 'Exceed the number of tradable units'],
        sellOrders: ['卖家订单', 'SellOrders'],
        buyOrders: ['买家订单', 'BuyOrders'],
        yourTrades: ['交易记录', 'Your Trades'],
        marketHistory: ['市场记录', 'Market History'],
        asset: ['资产', 'Asset']
    })
    const {prepareTime, tradeTime, playerLimit} = CONFIG
    const [countDown, setCountDown] = React.useState(-MATCH_TIME)
    const [price, setPrice] = React.useState('' as number | string)
    const [count, setCount] = React.useState(1 as number | string)
    React.useEffect(() => {
        frameEmitter.on(PushType.countDown, ({countDown}) => setCountDown(countDown))
        frameEmitter.emit(MoveType.getIndex)
    }, [])
    if (gameState.stage === GameStage.matching) {
        return <>
            <MatchModal {...{
                visible: true,
                totalNum: playerLimit,
                matchNum: gameState.playerIndex,
                timer: -countDown
            }}/>
        </>
    }
    const gamePeriodState = gameState.periods[gameState.periodIndex]
    if (gamePeriodState.stage === PeriodStage.result) {
        return <Result count={playerState.count} point={playerState.point}/>
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

    function submitOrder(role: ROLE) {
        const _price = Number(price || 0)
        const minSellOrder = orderDict[sellOrderIds[0]],
            maxBuyOrder = orderDict[buyOrderIds[0]]
        if (role === ROLE.Seller && minSellOrder && _price > minSellOrder.price) {
            return Toast.warn(lang.invalidSellPrice)
        }
        if (role === ROLE.Buyer && maxBuyOrder && _price < maxBuyOrder.price) {
            return Toast.warn(lang.invalidBuyPrice)
        }
        if (count <= 0 || (role === ROLE.Buyer && _price * +count > playerState.point) || (role === ROLE.Buyer && count > playerState.count)) {
            setCount(0)
            return Toast.warn(lang.invalidCount)
        }
        frameEmitter.emit(MoveType.submitOrder, {
            price: _price,
            count: +count,
            role
        })
    }

    function renderOrderPanel() {
        const timeLeft = tradeTime + prepareTime - countDown
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
                                    <div className={style.orderInputWrapper}>
                                        <label>{lang.shout4UnitPls}</label>
                                        <Input {...{
                                            value: price || '',
                                            placeholder: lang.price,
                                            onChange: price => setPrice(price),
                                            onMinus: price => setPrice(price - 1),
                                            onPlus: price => setPrice(price + 1)
                                        }}/>
                                        <Input {...{
                                            value: count || '',
                                            placeholder: lang.count,
                                            onChange: count => setCount(count),
                                            onMinus: count => setCount(count - 1),
                                            onPlus: count => setCount(count + 1)
                                        }}/>
                                    </div>
                                    <div className={style.submitBtnWrapper}>
                                        <Button {...{
                                            label: lang.Sell,
                                            onClick: () => submitOrder(ROLE.Seller)
                                        }}/>
                                        <Button {...{
                                            label: lang.Buy,
                                            onClick: () => submitOrder(ROLE.Buyer)
                                        }}/>
                                    </div>
                                    <div
                                        className={style.timeLeft}>{countDown < prepareTime ? '   ' : timeLeft > 0 ? timeLeft : 0}s
                                    </div>
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
                    <label>{lang.count}</label>
                    <em>{playerState.count}</em>
                </div>
                <div>
                    <label>{lang.point}</label>
                    <em>{playerState.point}</em>
                </div>
            </div>
        </section>
    }

    function renderTradePanel() {
        let tradeCount = 0
        return <div className={style.yourTradesWrapper}>
            {
                renderAsset()
            }
            <Line text={lang.yourTrades} style={STYLE.titleLineStyle}/>
            <Border background={STYLE.mainPanelBorder}>
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
            <label>{shoutRole === ROLE.Seller ? lang.sellOrders : lang.buyOrders}</label>
            <ul className={style.orderPrices}>
                {
                    marketOrderIds.map((orderId, i) => {
                            const orderX = orderDict[orderId],
                                isMine = orderX.playerIndex === playerState.playerIndex
                            return <li key={orderId}>
                                <Border key={orderId}
                                        borderRadius='.25rem'
                                        background={'radial-gradient(at 50% 0%, #aaa 1rem, transparent 70%)'}
                                        style={{marginTop: '.5rem'}}>
                                    <div className={style.orderPrice}>
                                        <label>{orderX.price}</label>*
                                        <label>{orderX.count}</label>
                                        {
                                            i && isMine ?
                                                <a className={style.btnCancel}
                                                   onClick={() => frameEmitter.emit(MoveType.cancelOrder)}>×</a> : null
                                        }
                                    </div>
                                </Border>
                            </li>
                        }
                    )
                }
            </ul>
        </section>
    }
}

export function Play(props: TPlayProps) {
    return <section className={style.play}>
        <_Play {...props}/>
    </section>
}