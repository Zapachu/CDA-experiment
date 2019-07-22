import * as React from 'react'
import {Core} from '@bespoke/client'
import {
    CONFIG,
    ICreateParams,
    IGameState,
    IMoveParams,
    IOrder,
    IPlayerState,
    IPushParams,
    MoveType,
    PeriodStage,
    PushType
} from '../config'
import {Lang, TPlayerState} from '@elf/component'
import {Col, List, Row, Table} from 'antd'
import {TradeChart} from './Play'
import * as style from './style.scss'

const {prepareTime, tradeTime} = CONFIG

type TPlay4OwnerProps = Core.IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>

function _Play4Owner({frameEmitter, gameState, playerStates}: TPlay4OwnerProps) {
    const lang = Lang.extractLang({
        roundOver: ['本轮结束', 'Round Over'],
        trading: ['交易中', 'Trading'],
        timeLeft: [(n, s) => `第${n}期，剩余${s}秒`, (n, s) => `Period : ${n}, time left : ${s}s`],
        marketWillOpen1: ['市场将在', 'Market will open in '],
        marketWillOpen2: [() => '秒后开放', n => `second${n > 1 ? 's' : ''}`],
        sellOrders: ['卖家订单', 'SellOrders'],
        buyOrders: ['买家订单', 'BuyOrders'],
        marketHistory: ['市场记录', 'Market History'],
        wait4players: ['等待玩家进入市场', 'Wait for players to enter the market']
    })
    const [countDown, setCountDown] = React.useState(-1)
    React.useEffect(() => {
        frameEmitter.on(PushType.countDown, ({countDown}) => setCountDown(countDown))
    }, [])
    const gamePeriodState = gameState.periods[gameState.periodIndex]
    const timeLeft = tradeTime + prepareTime - countDown
    switch (gamePeriodState.stage) {
        case PeriodStage.reading:
            return <section className={style.waitInfo}>
                {
                    countDown > prepareTime ? null : countDown > prepareTime ?
                        <span>{lang.marketWillOpen1}
                            <em>{prepareTime - countDown}</em> {(lang.marketWillOpen2 as Function)(prepareTime - countDown)}
                </span> :
                        <span>{lang.wait4players}</span>
                }
            </section>
        case PeriodStage.trading:
            return renderTrading()
        case PeriodStage.result:
            return <span className={style.label}>{lang.roundOver}</span>
    }

    function renderTrading() {
        const {trades, buyOrderIds, sellOrderIds} = gamePeriodState,
            orderDict: { [id: number]: IOrder } = (() => {
                const orderDict: { [id: number]: IOrder } = {}
                gamePeriodState.orders.forEach(order => {
                    orderDict[order.id] = order
                })
                return orderDict
            })()
        return <>
            <label
                className={style.periodInfo}>{`${lang.trading}  ${lang.timeLeft(gameState.periodIndex + 1, countDown < prepareTime ? '' : timeLeft > 0 ? timeLeft : 0)}`}</label>
            <Row>
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
                            tradeList={trades.map(({reqOrderId}) => {
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
            <Row>
                <Col xs={{span: 22, offset: 1}} md={{span: 12, offset: 6}}>
                    {
                        playerStatesTable(playerStates)
                    }
                </Col>
            </Row>
        </>
    }
}

export function Play4Owner(props: TPlay4OwnerProps) {
    return <section className={style.play4owner}>
        <_Play4Owner {...props}/>
    </section>
}

export function playerStatesTable(playerStates: { [token: string]: TPlayerState<IPlayerState> }) {
    const lang = Lang.extractLang({
        player: ['玩家', 'Player'],
        stock: ['股票', 'Stock'],
        money: ['金额', 'Money'],
        guaranteeCount: ['已融券', 'GuaranteeCount'],
        guaranteeMoney: ['已融资', 'GuaranteeMoney']
    })
    return <Table
        dataSource={Object.values(playerStates).map(({actor, user, count, money, guaranteeCount, guaranteeMoney}: TPlayerState<IPlayerState>, i) => ({
            key: actor.token,
            player: user.name||`Player ${i+1}`,
            money,
            count,
            guaranteeCount,
            guaranteeMoney
        }))}
        columns={[
            {
                title: lang.player,
                dataIndex: 'player',
                key: 'player'
            },
            {
                title: lang.money,
                dataIndex: 'money',
                key: 'money'
            },
            {
                title: lang.stock,
                dataIndex: 'count',
                key: 'count'
            },
            {
                title: lang.guaranteeMoney,
                dataIndex: 'guaranteeMoney',
                key: 'guaranteeMoney'
            },
            {
                title: lang.guaranteeCount,
                dataIndex: 'guaranteeCount',
                key: 'guaranteeCount'
            }
        ]}/>
}