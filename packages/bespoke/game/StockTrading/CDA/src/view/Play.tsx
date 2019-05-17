import * as React from 'react'
import * as style from './style.scss'
import {Core, FrameEmitter, IGame, Lang, MaskLoading, Toast} from 'bespoke-client-util'
import {
    GameGroupState,
    ICreateParams,
    IGameGroupState,
    IGameState,
    IMoveParams,
    IPlayerGroupState,
    IPlayerState,
    IPushParams
} from '../interface'
import {FetchType, MATCH_TIME, MoveType, PushType, ROLE, Stage} from '../config'
import {Button, Header, Input, Line, MatchModal, PlayMode} from '../../../components'

//region component
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
            overflow: "hidden",
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
                            r: count / 4 + 1.5
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

//endregion

//region stage
interface IStageProps {
    game: IGame<ICreateParams>
    gameState?: IGameGroupState
    playerState?: IPlayerGroupState
    frameEmitter?: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
    countDown?: number
}

function NotStart({frameEmitter}: { frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams> }) {
    return <section className={style.notStart}>
        <Line text={'交易规则介绍'} style={{margin: '10vh 0 2rem'}}/>
        <video className={style.introVideo}/>
        <PlayMode onPlay={groupType => frameEmitter.emit(MoveType.getGroup, {groupType})}/>
    </section>
}

function Matching({game: {params: {roles}}, frameEmitter, gameState, countDown}: IStageProps) {
    return <>
        <NotStart frameEmitter={frameEmitter}/>
        <MatchModal {...{
            visible: !!gameState,
            totalNum: roles.length,
            matchNum: gameState.roleIndex,
            timer: MATCH_TIME - countDown
        }}/>
    </>
}

function Trading({
                     frameEmitter, countDown,
                     game: {params: {roles, prepareTime, tradeTime}},
                     gameState: {orders, stage, buyOrderIds, sellOrderIds, trades},
                     playerState: {roleIndex, units}
                 }: IStageProps) {
    const lang = Lang.extractLang({
            price: ['价格', 'Price'],
            count: ['数量', 'Count'],
            profit: ['利润', 'Profit'],
            tradeCount: ['成交数量', 'Trade Count'],
            totalProfit: ['总利润', 'Total Profit'],
            unitNumber: ['物品序号', 'Unit Number'],
            unitCost: ['物品成本', 'Unit Cost'],
            unitCount: ['物品数量', 'Unit Count'],
            unitValue: ['物品价值', 'Unit Value'],
            allTraded: ['所有物品交易完成', 'All units have been traded'],
            shout4UnitPls: ['请为当前物品报价：价格 * 数量', 'Shout for this unit please : price * count'],
            openMarket: ['开放市场', 'Open Market'],
            marketWillOpen1: ['市场将在', 'Market will open in '],
            marketWillOpen2: [() => '秒后开放', n => `second${n > 1 ? 's' : ''}`],
            shout: ['报价', 'Shout'],
            cancel: ['撤回', 'Cancel'],
            [ROLE[ROLE.Buyer]]: ['买家', 'Buyer'],
            [ROLE[ROLE.Seller]]: ['卖家', 'Seller'],
            tradeSeq: ['订单序号', 'Trade Number'],
            tradeCost: ['物品成本', 'Cost'],
            tradeValue: ['物品价值', 'Value'],
            tradePrice: ['成交价格', 'Price'],
            invalidBuyPrice: ['订单价格需在市场最高买价与当前物品价值之间', 'Order price must be between your private value and the highest buy price in the market'],
            invalidSellPrice: ['订单价格需在当前物品成本与市场最低卖价之间', 'Order price must be between the lowest buy price in the market and your private cost'],
            invalidCount: ['超出可交易物品数量', 'Exceed the number of tradable units'],
            sellOrders: ['卖家订单', 'SellOrders'],
            buyOrders: ['买家订单', 'BuyOrders'],
            yourTrades: ['交易记录', 'Your Trades'],
            marketHistory: ['市场记录', 'Market History'],
        }),
        timer = countDown - MATCH_TIME
    const [price, setPrice] = React.useState('' as number | string)
    const [count, setCount] = React.useState(1 as number | string)
    const unitIndex = units.findIndex(({count}) => !!count)
    const role = roles[roleIndex]
    const orderDict: { [id: number]: GameGroupState.IOrder } = (() => {
        const orderDict: { [id: number]: GameGroupState.IOrder } = {}
        orders.forEach(order => {
            orderDict[order.id] = order
        })
        return orderDict
    })()
    const timeLeft = tradeTime + prepareTime - timer
    const titleLineStyle: React.CSSProperties = {
        maxWidth: '24rem',
        fontSize: '1.2rem',
        margin: '2rem auto 1rem'
    }
    const mainPanelBorder = `linear-gradient(#ddd, transparent)`
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

    function submitOrder() {
        const _price = Number(price || 0)
        const unit = units[unitIndex],
            minSellOrder = orderDict[sellOrderIds[0]],
            maxBuyOrder = orderDict[buyOrderIds[0]]
        if (role === ROLE.Seller && (_price < unit.price || (minSellOrder && _price > minSellOrder.price))) {
            return Toast.warn(lang.invalidSellPrice)
        }
        if (role === ROLE.Buyer && (_price > unit.price || (maxBuyOrder && _price < maxBuyOrder.price))) {
            return Toast.warn(lang.invalidSellPrice)
        }
        if (count > unit.count) {
            setCount(unit.count)
            return Toast.warn(lang.invalidCount)
        }
        frameEmitter.emit(MoveType.submitOrder, {
            unitIndex,
            price: _price,
            count: +count
        })
    }

    function renderOrderPanel() {
        return <Border style={{flexBasis: '40rem'}} background={mainPanelBorder}>
            <div className={style.orderPanel}>
                <Line text={lang[ROLE[role]]} style={titleLineStyle}/>
                <section className={style.orderBook}>
                    {
                        renderOrderList(buyOrderIds, ROLE.Buyer)
                    }
                    {
                        renderOrderList(sellOrderIds, ROLE.Seller)
                    }
                </section>
                {
                    unitIndex == -1 ?
                        <div className={style.allTraded}>{lang.allTraded}</div> :
                        <section className={style.orderSubmission}>
                            <h3 className={style.title}>{lang.currentAllocation}</h3>
                            <Border style={{margin: 'auto'}}>
                                <div className={style.curUnitInfo}>
                                    <div>
                                        <label>{lang.unitNumber}</label>
                                        <em>{unitIndex + 1}</em>
                                    </div>
                                    <div>
                                        <label>{role === ROLE.Buyer ? lang.unitValue : lang.unitCost}</label>
                                        <em>{units[unitIndex].price}</em>
                                    </div>
                                    <div>
                                        <label>{lang.unitCount}</label>
                                        <em>{units[unitIndex].count}</em>
                                    </div>
                                </div>
                            </Border>
                            {
                                stage === Stage.reading && prepareTime > timer ?
                                    <p className={style.marketWillOpen}>{lang.marketWillOpen1}
                                        <em>{prepareTime - timer}</em> {(lang.marketWillOpen2 as Function)(prepareTime - timer)}
                                    </p> :
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
                                                label: lang.shout,
                                                onClick: () => submitOrder()
                                            }}/>
                                        </div>
                                        <div
                                            className={style.timeLeft}>{timer < prepareTime ? '   ' : timeLeft > 0 ? timeLeft : 0}s
                                        </div>
                                    </section>
                            }
                        </section>
                }
            </div>
        </Border>
    }

    function renderTradePanel() {
        let tradeCount = 0, totalProfit = 0
        const role = roles[roleIndex]
        return <div className={style.yourTradesWrapper}>
            <Line text={lang.yourTrades} style={titleLineStyle}/>
            <Border background={mainPanelBorder}>
                <div className={style.yourTrades}>
                    <div className={style.tradeListWrapper}>
                        <table className={style.tradeList}>
                            <thead>
                            <tr>
                                <th>{lang.tradeSeq}</th>
                                <th>{role === ROLE.Seller ? lang.tradePrice : lang.tradeValue}</th>
                                <th>{role === ROLE.Seller ? lang.tradeCost : lang.tradePrice}</th>
                                <th>{lang.unitCount}</th>
                                <th>{lang.profit}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                trades.map(({reqOrderId, resOrderId, count}, i) => {
                                    const reqOrder = orderDict[reqOrderId],
                                        resOrder = orderDict[resOrderId]
                                    if (![reqOrder.roleIndex, resOrder.roleIndex].includes(roleIndex)) {
                                        return null
                                    }
                                    const privateCost = units[roleIndex === reqOrder.roleIndex ? reqOrder.unitIndex : resOrder.unitIndex].price,
                                        price = reqOrder.price,
                                        profit = Math.abs(privateCost - reqOrder.price) * count
                                    tradeCount += count
                                    totalProfit += profit
                                    return <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{role === ROLE.Seller ? price : privateCost}</td>
                                        <td>{role === ROLE.Seller ? privateCost : price}</td>
                                        <td>{count}</td>
                                        <td>{profit}</td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                    <Border style={{margin: 'auto'}}>
                        <div className={style.summary}>
                            <div>
                                <label>{lang.tradeCount}</label>
                                <em>{tradeCount}</em>
                            </div>
                            <div>
                                <label>{lang.totalProfit}</label>
                                <em>{totalProfit}</em>
                            </div>
                        </div>
                    </Border>
                </div>
            </Border>
        </div>
    }

    function renderChartPanel() {
        return <div className={style.marketHistoryWrapper}>
            <Line text={lang.marketHistory} style={titleLineStyle}/>
            <Border background={mainPanelBorder}>
                <div className={style.marketHistory}>
                    <h3 className={style.title}>{lang.tradeHistory}</h3>
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
                                isMine = orderX.roleIndex === roleIndex
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

function Result({playerState: {point, tradedCount}, frameEmitter}: IStageProps) {
    const lang = Lang.extractLang({
        toEnterNextPhase1: ['您成功交易了', 'You traded'],
        toEnterNextPhase2: ['单位虚拟物品，共获得', ' goods in this market, and earned'],
        toEnterNextPhase3: ['实验币的利润。', ' experimental currency.'],
        onceAgain: ['再来一次', 'Once Again'],
        nextPhase: ['下一环节', 'Next Phase'],
    })
    return <section className={style.result}>
        <p>
            {lang.toEnterNextPhase1}
            <em>{tradedCount}</em>
            {lang.toEnterNextPhase2}
            <em>{point}</em>
            {lang.toEnterNextPhase3}
        </p>
        <div className={style.switchBtns}>
            <Button label={lang.onceAgain}
                    onClick={() => frameEmitter.emit(MoveType.leaveGroup)}/>&nbsp;&nbsp;&nbsp;
            <Button label={lang.nextPhase} onClick={() => console.log('TODO')}/>
        </div>
    </section>
}

//endregion

type TPlayProps = Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>

function _Play({game, gameState, playerState, frameEmitter}: TPlayProps) {
    const [countDown, setCountDown] = React.useState(0)
    React.useEffect(() => {
        frameEmitter.on(PushType.countDown, ({countDown}) => setCountDown(countDown))
    }, [])
    const {groupIndex} = playerState,
        gameGroupState = gameState.groups[groupIndex],
        playerGroupState = playerState.groups[groupIndex]
    if (!gameGroupState) {
        return <NotStart frameEmitter={frameEmitter}/>
    }
    const stageProps: IStageProps = {
        game,
        gameState: gameGroupState,
        playerState: playerGroupState,
        frameEmitter,
        countDown
    }
    switch (stageProps.gameState.stage) {
        case Stage.matching:
            return <Matching {...stageProps}/>
        case Stage.reading:
        case Stage.trading:
            return <Trading {...stageProps}/>
        case Stage.result:
            return <Result {...stageProps}/>
    }
}

export function Play(props: TPlayProps) {
    return <section className={style.play}>
        {/* <Header stage={Header.Stage.CBM}/> */}
        <_Play {...props}/>
    </section>
}