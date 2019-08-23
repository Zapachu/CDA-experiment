import * as React from 'react'
import * as style from './style.scss'
import {Core} from '@bespoke/client'
import {ICreateParams, IGameState, IMoveParams, IOrder, IPlayerState, MoveType, PeriodStage, ROLE} from '../config'
import {Lang} from '@elf/component'
import {Col, List, Row, Slider} from 'antd'
import {TradeChart} from './Play'
import {playerStatesTable} from './Play4Owner'

export function Result4Owner({travelStates}: Core.IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams>) {
    const lang = Lang.extractLang({
        action: ['操作', 'Action'],
        roundOver: ['本轮结束', 'Round Over'],
        trading: ['交易中', 'Trading'],
        timeLeft: [(n, s) => `第${n}期，剩余${s}秒`, (n, s) => `Period : ${n}, time left : ${s}s`],
        marketWillOpen1: ['市场将在', 'Market will open in '],
        marketWillOpen2: [() => '秒后开放', n => `second${n > 1 ? 's' : ''}`],
        sellOrders: ['卖家订单', 'SellOrders'],
        buyOrders: ['买家订单', 'BuyOrders'],
        marketHistory: ['市场记录', 'Market History'],
        wait4players: ['等待玩家进入市场', 'Wait for players to enter the market'],
        cannotTravel: ['实验过程无法回溯', 'Cannot review game state with timeline'],
        timeLine: ['时间线', 'Time Line']
    })
    const [time, setTime] = React.useState(0)
    if (!travelStates.length) {
        return <section style={{fontSize: '1.5rem', margin: '2rem', textAlign: 'center'}}>{lang.cannotTravel}</section>
    }
    const {type, params, gameState, playerStates} = travelStates[time]
    return <section className={style.result4Owner}>
        <Row>
            <Col xs={{span: 22, offset: 1}} md={{span: 12, offset: 6}}>
                <div className={style.timeLine}>
                    <label>{lang.timeLine}</label>
                    <Slider min={0} max={travelStates.length - 1} value={time} onChange={t => setTime(t as number)}/>
                </div>
                <div className={style.actionInfo}>
                    {lang.action} {actionInfo(type, params)}
                </div>
                {
                    renderMarket()
                }
                {
                    playerStatesTable(playerStates)
                }
            </Col>
        </Row>
    </section>

    function actionInfo(type: MoveType, params: IMoveParams) {
        const lang = Lang.extractLang({
            getIndex: ['【进入市场】', '【Enter Market】'],
            submitOrder: ['【报价】', '【Shout】'],
            cancelOrder: ['【取消报价】', '【CancelShout】'],
            repayCount: ['【还券】', '【Repay Count】'],
            repayMoney: ['【还款】', '【Repay Money】'],
            price: ['价格', 'Price'],
            count: ['数量', 'Count'],
            role: ['角色', 'Role']
        })
        switch (type) {
            case MoveType.getIndex:
                return lang.getIndex
            case MoveType.submitOrder:
                return `${lang.submitOrder} ${lang.role}:${ROLE[params.role]}  ${lang.price}:${params.price}  ${lang.count}:${params.count}`
            case MoveType.cancelOrder:
                return lang.cancelOrder
            case MoveType.repayCount:
                return `${lang.repayCount}${params.countRepay}`
            case MoveType.repayMoney:
                return `${lang.repayMoney}${params.moneyRepay}`
        }
    }

    function renderMarket() {
        const gamePeriodState = gameState.periods[gameState.periodIndex]
        switch (gamePeriodState.stage) {
            case PeriodStage.trading:
                const {trades, buyOrderIds, sellOrderIds} = gamePeriodState,
                    orderDict: { [id: number]: IOrder } = (() => {
                        const orderDict: { [id: number]: IOrder } = {}
                        gamePeriodState.orders.forEach(order => {
                            orderDict[order.id] = order
                        })
                        return orderDict
                    })()
                return <Row>
                    <Col xs={22} md={8} offset={1}>
                        <Row>
                            <Col span={12}>
                                <label>{lang.sellOrders}</label>
                                <List dataSource={sellOrderIds} renderItem={id =>
                                    <List.Item>{orderDict[id].price}</List.Item>
                                }/>
                            </Col>
                            <Col span={12}>
                                <label>{lang.buyOrders}</label>
                                <List dataSource={buyOrderIds} renderItem={id =>
                                    <List.Item>{orderDict[id].price}</List.Item>
                                }/>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={22} md={14} offset={1}>
                        <label>{lang.marketHistory}</label>
                        <div className={style.chartWrapper}>
                            <TradeChart
                                tradeList={trades.sort(({reqOrderId: r1}, {reqOrderId: r2}) => r1 - r2)
                                    .map(({reqOrderId}) => {
                                        const {price, count} = orderDict[reqOrderId]
                                        return {price, count}
                                    })}
                                color={{
                                    scalePlate: '#999',
                                    line: '#f99460',
                                    point: '#f99460',
                                    title: '#aff85e',
                                    number: '#f99460'
                                }}
                            />
                        </div>
                    </Col>
                </Row>

            case PeriodStage.result:
                return <span className={style.label}>{lang.roundOver}</span>
        }
    }
}