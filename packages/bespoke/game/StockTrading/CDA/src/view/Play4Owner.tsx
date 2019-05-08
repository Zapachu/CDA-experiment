import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, Button, MaskLoading, baseEnum} from 'bespoke-client-util'
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchType, Stage, MoveType, PushType, ROLE} from '../config'
import {TradeChart} from './Play'

interface IPlay4OwnerState {
    timer?: number
}

export class Play4Owner extends Core.Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlay4OwnerState> {
    lang = Lang.extractLang({
        gameHasNotStarted: ['实验尚未开始', 'Experiment has not started'],
        shoutInfo: ['报价信息', 'Shout Info'],
        price: ['价格', 'Price'],
        unitIndex: ['物品序号', 'UnitIndex'],
        buyOrders: ['买家订单', 'Buy Order'],
        sellOrders: ['卖家订单', 'Sell Order'],
        position: ['玩家编号', 'Player Seq'],
        role: ['角色', 'Role'],
        marketClosed: ['市场关闭', 'Market Closed'],
        readingInfo: ['阅览市场信息', 'Reading market infomation'],
        trading: ['交易中', 'Trading'],
        showResult: ['展示结果', 'Show result'],
        unknown: ['???', '???'],
        [ROLE[ROLE.Buyer]]: ['买家', 'Buyer'],
        [ROLE[ROLE.Seller]]: ['卖家', 'Seller']
    })

    state: IPlay4OwnerState = {}

    componentDidMount(): void {
        const {frameEmitter} = this.props
        if (!frameEmitter) {
            return null
        }
        frameEmitter.on(PushType.countDown, ({countDown}) => {
            this.setState({timer: countDown})
        })
    }

    renderPlayerStatusTable() {
        const {lang, props: {game, playerStates}} = this,
            {roles} = game.params
        return <table className={style.playerStatusTable}>
            <tbody>
            <tr>
                <td>{lang.position}</td>
                <td>{lang.role}</td>
            </tr>
            {
                Object.values(playerStates).sort(({positionIndex: p1}, {positionIndex: p2}) => p1 - p2)
                    .map(({positionIndex}, i) => <tr key={i}>
                        <td>{positionIndex === undefined ? lang.unknown : positionIndex + 1}</td>
                        <td>{roles[positionIndex] === undefined ? lang.unknown : lang[ROLE[roles[positionIndex]]]}</td>
                    </tr>)
            }
            </tbody>
        </table>
    }

    renderMainGame() {
        const {lang, props: {token, type, params, game, gameState, playerStates}, state: {timer}} = this
        const {roles, prepareTime, tradeTime} = game.params,
            {trades, sellOrderIds, buyOrderIds} = gameState
        const orderDict: { [id: number]: GameState.IOrder } = {}
        gameState.orders.forEach(order => {
            orderDict[order.id] = order
        })
        const activePlayerState = playerStates[token]
        return <section className={style.mainGame}>
            <div className={style.marketInfo}>
                <div className={style.orderList}>
                    <ul><label>{lang.shoutInfo}</label>
                        {
                            type === MoveType.submitOrder ? <React.Fragment>
                                <li>{lang[ROLE[roles[activePlayerState.positionIndex]]]}：{activePlayerState.positionIndex + 1}</li>
                                <li>{lang.unitIndex}：{params.unitIndex + 1}</li>
                                <li>{lang.price}：{params.price}</li>
                            </React.Fragment> : null
                        }
                    </ul>
                    <ul><label>{lang.buyOrders}</label>
                        {buyOrderIds.map(orderId => <li key={orderId}>{orderDict[orderId].price}</li>)}
                    </ul>
                    <ul><label>{lang.sellOrders}</label>
                        {sellOrderIds.map(orderId => <li key={orderId}>{orderDict[orderId].price}</li>)}
                    </ul>
                </div>
                <div className={style.countdownLabel}>
                    {
                        timer ? timer < prepareTime ?
                            <label>{lang.readingInfo}<em>{prepareTime - timer}</em>s</label> :
                            timer < ((+prepareTime) + (+tradeTime)) ?
                                <label>{lang.trading}<em>{+tradeTime + +prepareTime - timer}</em>s</label> :
                                <label>{lang.showResult}<em>{+tradeTime + 2 * prepareTime - timer}</em>s</label> : null
                    }
                </div>
            </div>
            <div className={style.chartPanel}>
                <div className={style.chartWrapper}>
                    <TradeChart tradeList={trades.map(({reqId}) => ({price: orderDict[reqId].price}))}/>
                </div>
            </div>
        </section>
    }

    renderMarket() {
        const {lang, props: {gameState}} = this
        switch (gameState.stage) {
            case Stage.leave:
                return <div className={style.blankMsg}>{lang.marketClosed}</div>
            default:
                return <React.Fragment>
                    {this.renderPlayerStatusTable()}
                    {this.renderMainGame()}
                </React.Fragment>
        }
    }

    render() {
        const {lang, props: {gameState}} = this
        if (gameState.status === baseEnum.GameStatus.notStarted) {
            return <MaskLoading label={lang.gameHasNotStarted}/>
        }
        return <section className={style.player4Owner}>
            {
                this.renderMarket()
            }
        </section>
    }
}
