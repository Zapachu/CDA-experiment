import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, Button, ButtonProps, MaskLoading, Toast, IGame, FrameEmitter} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, GameState} from '../interface'
import {FetchType, Stage, MoveType, PushType, ROLE, HOST_POSITION} from '../config'

export const TradeChart: React.FC<{
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

export const Play: Core.PlaySFC<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> =
    props => {
        switch (props.gameState.stage) {
            case Stage.matching:
                return <Matching {...props}/>
            case Stage.leave:
                return <div>跳转至其它环节(TODO)</div> //TODO
            default:
                return <Trading {...props}/>
        }
    }

interface IStageProps {
    game: IGame<ICreateParams>
    gameState?: IGameState
    playerState?: IPlayerState
    frameEmitter?: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
}

function Matching({game: {params: {roles}}, frameEmitter, gameState: {roleIndex: gameRoleIndex}, playerState: {roleIndex}}: IStageProps) {
    const lang = Lang.extractLang({
        playersInMarket: ['市场中玩家', 'Players in Market'],
        openMarket: ['开放市场', 'Open Market'],
        startRobot: ['启动机器人', 'Start Robot']
    })
    React.useEffect(() => {
        frameEmitter.emit(MoveType.getRole)
    }, [])
    return <section className={style.matching}>
        <div>{lang.playersInMarket}:{gameRoleIndex}</div>
        {
            roleIndex === HOST_POSITION ?
                <div>
                    <Button {...{
                        label: lang.openMarket,
                        onClick: () => frameEmitter.emit(MoveType.openMarket)
                    }}/>
                    <Button {...{
                        label: lang.startRobot,
                        onClick: () => frameEmitter.emit(MoveType.startRobot)
                    }}/>
                </div> : null
        }
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
        position: ['位置', 'Position'],
        role: ['角色', 'Your Role'],
        timeLeft: ['剩余时间', 'Time Left'],
        profit: ['物品利润', 'Box Profit'],
        currentProfit: ['本期总利润', 'Profit in current period'],
        unitNumber: ['物品序号', 'Unit Number'],
        unitCost: ['物品成本', 'Unit Cost'],
        unitValue: ['物品价值', 'Unit Value'],
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
        buyOrders: ['买家订单', 'BuyOrders']
    })
    const [price, setPrice] = React.useState(0 as number | string)
    const [timer, setTimer] = React.useState(0)
    React.useEffect(() => {
        frameEmitter.on(PushType.countDown, ({countDown}) => setTimer(countDown))
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
                            isMine = orderX.roleIndex === roleIndex
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
    return <section className={`${style.mainGame} ${style.playContent}`}>
        <ul className={style.header}>
            <li>{lang.position} : <em>{roleIndex + 1}</em></li>
            <li>{lang.role} : <em>{lang[ROLE[role]]}</em></li>
            <li>{lang.timeLeft} : <em>{timer < prepareTime ? '   ' : timeLeft > 0 ? timeLeft : 0}</em>s</li>
        </ul>
        {
            stage === Stage.result ?
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
                                    renderOrderList(orderDict, buyOrderIds, ROLE.Buyer)
                                }
                                {
                                    renderOrderList(orderDict, sellOrderIds, ROLE.Seller)
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
                                stage === Stage.prepare && prepareTime > timer ?
                                    <p className={style.marketWillOpen}>{lang.marketWillOpen1}
                                        <em>{prepareTime - timer}</em> {(lang.marketWillOpen2 as Function)(prepareTime - timer)}
                                    </p> :
                                    <section className={style.newOrder}>
                                        <div className={style.orderInputWrapper}>
                                            <input {...{
                                                autoFocus: true,
                                                value: price || '',
                                                onChange: ({target: {value: price}}) => setPrice(price)
                                            }}/>
                                        </div>
                                        <div className={style.submitBtnWrapper}>
                                            <Button {...{
                                                label: lang.shout,
                                                type: ButtonProps.Type.primary,
                                                width: ButtonProps.Width.medium,
                                                onClick: () => submitOrder()
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

