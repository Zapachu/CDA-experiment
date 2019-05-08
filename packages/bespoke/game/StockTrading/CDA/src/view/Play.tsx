import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, Button, ButtonProps, MaskLoading, Toast, FrameEmitter, IGame} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, GameState} from '../interface'
import {FetchType, MarketStage, MoveType, PushType, ROLE, PlayerStatus} from '../config'

export const Play: Core.PlaySFC<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> = props => {
    switch (props.gameState.marketStage) {
        case MarketStage.assignRole:
            return <AssignRole {...props}/>
        case MarketStage.leave:
            return <Result {...props}/>
        default:
            return <MainGame {...props}/>
    }
}

interface IStageProps {
    game: IGame<ICreateParams>
    gameState?: IGameState
    playerState?: IPlayerState
    frameEmitter?: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
}

const AssignRole: React.FC<IStageProps> = ({game, frameEmitter, playerState: {positionIndex, status}}) => {
    const lang = Lang.extractLang({
        wait4position: ['等待系统分配角色', 'Waiting for the system to assign your role'],
        enterMarket: ['进入市场', 'Enter Market'],
        toEnterMarket: ['您将进入某一市场，您的角色为：', 'You will enter a market, and your role is : '],
        wait4MarketOpen: ['等待市场开放', 'Waiting for market opening'],
        [ROLE[ROLE.Buyer]]: ['买家', 'Buyer'],
        [ROLE[ROLE.Seller]]: ['卖家', 'Seller']
    })
    return positionIndex === undefined ?
        <MaskLoading label={lang.wait4position}/> :
        <section className={`${style.assignPosition} ${style.playContent}`}>
            <p>{lang.toEnterMarket}<em>{lang[ROLE[game.params.roles[positionIndex]]]}</em>
            </p>
            {
                status === PlayerStatus.wait4MarketOpen ?
                    <MaskLoading label={lang.wait4MarketOpen}/> :
                    <section className={style.seatNumberStage}>
                        <Button width={ButtonProps.Width.medium} label={lang.enterMarket} onClick={() => {
                            frameEmitter.emit(MoveType.enterMarket)
                        }}/>
                    </section>
            }
        </section>
}

const MainGame: React.FC<IStageProps> = ({
                                             frameEmitter,
                                             game: {params: {roles, time2ReadInfo, durationOfEachPeriod}},
                                             gameState: {orders, marketStage, buyOrderIds, sellOrderIds, trades, positionUnitIndex},
                                             playerState: {positionIndex, unitList}
                                         }) => {
    const lang = Lang.extractLang({
        role: ['角色', 'Your Role'],
        timeLeft: ['剩余时间', 'Time Left'],
        profit: ['物品利润', 'Box Profit'],
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
    const [price, setPrice] = React.useState(0 as number | string)
    const [timer, setTimer] = React.useState(0)
    React.useEffect(() => {
        frameEmitter.on(PushType.periodCountDown, ({periodCountDown}) => setTimer(periodCountDown))
    }, [])

    function submitOrder() {
        const _price = Number(price || 0)
        const orderDict: { [id: number]: GameState.IOrder } = {}
        orders.forEach(order => {
            orderDict[order.id] = order
        })
        const role = roles[positionIndex]
        const privateCost = Number(unitList.split(' ')[positionUnitIndex[positionIndex]]),
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
            unitIndex: positionUnitIndex[positionIndex],
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

    function renderTradeList(orderDict: { [id: number]: GameState.IOrder }, trades: Array<GameState.ITrade>): [number, number, React.ReactNode] {
        const role = roles[positionIndex]
        const unitPrices = unitList.split(' ').map(price => +price)
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

    if (positionIndex === undefined) {
        return <MaskLoading label={lang.noPosition}/>
    }
    const orderDict: { [id: number]: GameState.IOrder } = {}
    orders.forEach(order => {
        orderDict[order.id] = order
    })
    const role = roles[positionIndex]
    const timeLeft = durationOfEachPeriod + time2ReadInfo - timer,
        time2NextPhase = durationOfEachPeriod + 2 * time2ReadInfo - timer
    const unitIndex = positionUnitIndex[positionIndex],
        unitPrice = +(unitList.split(' ')[unitIndex] || 0)
    const [tradeCount, profit, tradeListFragment] = renderTradeList(orderDict, trades)
    return <section className={`${style.mainGame} ${style.playContent}`}>
        <ul className={style.header}>
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
                                    marketStage === MarketStage.readDescription && time2ReadInfo > timer ?
                                        <p className={style.marketWillOpen}>{lang.marketWillOpen1}
                                            <em>{time2ReadInfo - timer}</em> {(lang.marketWillOpen2 as Function)(time2ReadInfo - timer)}
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

const Result: React.FC<IStageProps> = ({game, frameEmitter}) => {
    const lang = Lang.extractLang({
        title1: ['在 ', 'Here are your transactions and profits in last '],
        title2: [' 期的市场实验中，您每期的交易及盈利情况如下：', ' periods :'],
        period: ['时期', 'Peroid'],
        tradedCount: ['交易单位', 'Traded Count'],
        profit: ['利润', 'Profit'],
        footLabel1: ['在该部分的实验中，您的收益为：', 'In this part of the game, your income is: '],
        footLabel2: [' 实验币，可换算为', ' game currency, can be converted to RMB'],
        footLabel3: [' 人民币', ''],
        total: ['合计', 'Total']
    })
    return <section className={style.phaseOver}>
        <p>您已完成该部分的实验，请在实验说明的结果记录表上填写您该部分的实验收益。</p>
        <p>点击下方按钮，跳转到输入快速加入码页面，并耐心等待实验员发放下一部分实验的快速加入码。</p>
        <div className={style.btnWrapper}>
            <Button {...{
                label: '进入实验下一部分',
                onClick: () => game.params.nextPhaseKey ?
                    frameEmitter.emit(MoveType.sendBackPlayer) :
                    location.href = '/bespoke/join'
            }}/>
        </div>
    </section>
}

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

