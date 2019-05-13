import * as React from 'react'
import * as style from './style.scss'
import {Core, FrameEmitter, IGame, Lang, MaskLoading, Toast} from 'bespoke-client-util'
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchType, MoveType, PushType, ROLE, Stage, MATCH_TIME} from '../config'
import {PlayMode, Header, Line, MatchModal, Input, Button} from '../../../components'

interface IStageProps {
    game: IGame<ICreateParams>
    gameState?: IGameState
    playerState?: IPlayerState
    frameEmitter?: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
}

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
            overflow: "hidden"
        }}>
            {children}
        </div>
    </div>
}

function Matching({game: {params: {roles}}, frameEmitter, gameState: {roleIndex: gameRoleIndex}, playerState: {roleIndex}}: IStageProps) {
    const [timer, setTimer] = React.useState(0)
    React.useEffect(() => {
        frameEmitter.on(PushType.countDown, ({countDown}) => setTimer(countDown))
    }, [])
    return <section className={style.matching}>
        <Line text={'交易规则介绍'} style={{margin: '10vh 0 2rem'}}/>
        <video className={style.introVideo}/>
        <PlayMode onPlay={playMode => frameEmitter.emit(MoveType.getRole, {playMode})}/>
        <MatchModal {...{
            visible: roleIndex !== undefined,
            totalNum: roles.length,
            matchNum: gameRoleIndex,
            timer: MATCH_TIME - timer
        }}/>
    </section>
}

function Trading(props: IStageProps) {
    const {
        frameEmitter,
        game: {params: {roles, prepareTime, tradeTime}},
        gameState: {orders, stage, buyOrderIds, sellOrderIds, trades, positionUnitIndex},
        playerState: {roleIndex, unitList}
    } = props
    const lang = Lang.extractLang({
        profit: ['物品利润', 'Box Profit'],
        tradeCount: ['成交数量', 'Trade Count'],
        totalProfit: ['总利润', 'Total Profit'],
        unitNumber: ['物品序号', 'Unit Number'],
        unitCost: ['物品成本', 'Unit Cost'],
        unitValue: ['物品价值', 'Unit Value'],
        shout4UnitPls: ['请为当前物品报价', 'Shout for this unit please'],
        openMarket: ['开放市场', 'Open Market'],
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
        buyOrders: ['买家订单', 'BuyOrders'],
        yourTrades: ['交易记录', 'Your Trades'],
        marketHistory: ['市场记录', 'Market History'],
    })
    const [price, setPrice] = React.useState(0 as number | string)
    const [timer, setTimer] = React.useState(0)
    React.useEffect(() => {
        frameEmitter.on(PushType.countDown, ({countDown}) => setTimer(countDown - MATCH_TIME))
    }, [])

    function submitOrder() {
        const _price = Number(price || 0)
        const orderDict: { [id: number]: GameState.IOrder } = {}
        orders.forEach(order => {
            orderDict[order.id] = order
        })
        const role = roles[roleIndex]
        const privateCost = Number(unitList.split(' ')[positionUnitIndex[roleIndex]]),
            minSellOrder = orderDict[sellOrderIds[0]],
            maxBuyOrder = orderDict[buyOrderIds[0]]
        if (!privateCost) {
            return
        }
        if (role === ROLE.Seller && (_price < privateCost || (minSellOrder && _price >= minSellOrder.price))) {
            return Toast.warn(lang.invalidSellPrice)
        }
        if (role === ROLE.Buyer && (_price > privateCost || (maxBuyOrder && _price <= maxBuyOrder.price))) {
            return Toast.warn(lang.invalidSellPrice)
        }
        frameEmitter.emit(MoveType.submitOrder, {
            unitIndex: positionUnitIndex[roleIndex],
            price: _price
        })
    }

    function renderOrderList(orderDict: { [id: number]: GameState.IOrder }, marketOrderIds: Array<number>, shoutRole) {
        return <section className={style.orderList}>
            <label>{shoutRole === ROLE.Seller ? lang.sellOrders : lang.buyOrders}</label>
            <ul className={style.orderPrices}>
                {
                    marketOrderIds.map((orderId, i) => {
                            const orderX = orderDict[orderId],
                                isMine = orderX.roleIndex === roleIndex
                            return <li>
                                <Border key={orderId}
                                        borderRadius='.25rem'
                                        background={'radial-gradient(at 50% 0%, #aaa 1rem, transparent 70%)'}
                                        style={{marginTop: '.5rem'}}>
                                    <div className={style.orderPrice}>
                                        <label>{orderX.price}</label>
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

    function renderTradeList(orderDict: { [id: number]: GameState.IOrder }, trades: Array<GameState.ITrade>): [number, number, React.ReactNode] {
        const role = roles[roleIndex]
        const unitPrices = unitList.split(' ').map(price => +price)
        const myTrades: Array<{
            privateCost: number,
            price?: number
        }> = unitPrices.map(privateCost => ({privateCost}))
        trades.forEach(({resId, reqId}) => {
            const reqOrder = orderDict[reqId],
                resOrder = orderDict[resId]
            switch (roleIndex) {
                case reqOrder.roleIndex: {
                    myTrades[reqOrder.unitIndex].price = reqOrder.price
                    break
                }
                case resOrder.roleIndex: {
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
                <th>{lang.unitNumber}</th>
                <th>{role === ROLE.Seller ? lang.tradePrice : lang.tradeValue}</th>
                <th>{role === ROLE.Seller ? lang.tradeCost : lang.tradePrice}</th>
                <th>{lang.profit}</th>
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

    if (roleIndex === undefined) {
        return <MaskLoading label={lang.noPosition}/>
    }
    const orderDict: { [id: number]: GameState.IOrder } = {}
    orders.forEach(order => {
        orderDict[order.id] = order
    })
    const role = roles[roleIndex]
    const timeLeft = tradeTime + prepareTime - timer,
        time2NextPhase = tradeTime + 2 * prepareTime - timer
    const unitIndex = positionUnitIndex[roleIndex],
        unitPrice = +(unitList.split(' ')[unitIndex] || 0)
    const [tradeCount, profit, tradeListFragment] = renderTradeList(orderDict, trades)
    const titleLineStyle: React.CSSProperties = {
        maxWidth: '24rem',
        fontSize: '1.2rem',
        margin: '2rem auto 1rem'
    }
    const mainPanelBorder = `linear-gradient(#ddd, transparent)`
    if(stage === Stage.result){
        return <section className={style.result}>
            <p>
                {lang.toEnterNextPhase1}
                <em>{tradeCount}</em>
                {lang.toEnterNextPhase2}
                <em>{profit}</em>
                {lang.toEnterNextPhase3}
                <em>{time2NextPhase}</em>
                {lang.toEnterNextPhase4}
            </p>
        </section>
    }
    return <section className={style.trading}>
        <div className={style.yourTradesWrapper}>
            <Line text={lang.yourTrades} style={titleLineStyle}/>
            <Border background={mainPanelBorder}>
                <div className={style.yourTrades}>
                    <div className={style.tradeListWrapper}>
                        {
                            tradeListFragment
                        }
                    </div>
                    <Border style={{margin: 'auto'}}>
                        <div className={style.summary}>
                            <div>
                                <label>{lang.tradeCount}</label>
                                <em>{tradeCount}</em>
                            </div>
                            <div>
                                <label>{lang.totalProfit}</label>
                                <em>{profit}</em>
                            </div>
                        </div>
                    </Border>
                </div>
            </Border>
        </div>
        <Border style={{flexBasis: '32rem'}} background={mainPanelBorder}>
            <div className={style.orderPanel}>
                <Line text={lang[ROLE[role]]} style={titleLineStyle}/>
                <section className={style.orderBook}>
                    {
                        renderOrderList(orderDict, buyOrderIds, ROLE.Buyer)
                    }
                    {
                        renderOrderList(orderDict, sellOrderIds, ROLE.Seller)
                    }
                </section>
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
                                <em>{unitPrice}</em>
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
                                        autoFocus: true,
                                        value: price || '',
                                        onChange: price => setPrice(price),
                                        onMinus: price => setPrice(price - 1),
                                        onPlus: price => setPrice(price + 1)
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
            </div>
        </Border>
        <div className={style.marketHistoryWrapper}>
            <Line text={lang.marketHistory} style={titleLineStyle}/>
            <Border background={mainPanelBorder}>
                <div className={style.marketHistory}>
                    <h3 className={style.title}>{lang.tradeHistory}</h3>
                    <div className={style.tradeChartWrapper}>
                        <TradeChart
                            tradeList={trades.map(({reqId}) => ({price: orderDict[reqId].price}))}
                            color={{
                                scalePlate: '#fff',
                                line: '#258df3',
                                point: '#258df3',
                                title: '#aff85e',
                                number: '#c18a71'
                            }}
                        />
                    </div>
                </div>
            </Border>
        </div>
    </section>
}

export const TradeChart: React.FC<{
    tradeList: Array<{
        price: number
    }>,
    color?: {
        scalePlate: string
        point: string,
        line: string
        title: string,
        number: string
    }
}> = ({
          tradeList, color = {
        scalePlate: '#999',
        line: '#999',
        title: '#999',
        number: '#999',
        point: '#E27B6A',
    }
      }) => {
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
                tradeList.map(({price}, i) =>
                    <React.Fragment key={i}>
                        <circle {...{
                            fill: color.point,
                            cx: transX(i + 1),
                            cy: transY(price),
                            r: 3
                        }}/>
                        {
                            i ? <line {...{
                                stroke: color.point,
                                strokeWidth: 1.5,
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

export const Play: Core.PlaySFC<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> =
    props => <section className={style.play}>
        <Header stage={'tbm'}/>
        {(() => {
            switch (props.gameState.stage) {
                case Stage.notStart:
                case Stage.matching:
                    return <Matching {...props}/>
                case Stage.leave:
                    return <div>跳转至其它环节(TODO)</div> //TODO
                default:
                    return <Trading {...props}/>
            }
        })()}
    </section>