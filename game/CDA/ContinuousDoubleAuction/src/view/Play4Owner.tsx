import * as React from 'react'
import * as style from './style.scss'
import { Core } from '@bespoke/client'
import { Button, Lang } from '@elf/component'
import { GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams } from '../interface'
import { MoveType, phaseNames, PlayerStatus, PushType, ROLE } from '../config'
import { TradeChart } from './phase/mainGame'

interface IPlay4OwnerState {
  timer?: number
}

export class Play4Owner extends Core.Play4Owner<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  IPlay4OwnerState
> {
  lang = Lang.extractLang({
    seatNumber: ['座位号', 'SeatNumber'],
    assignPosition: ['分发角色', 'ASSIGN POSITION'],
    openMarket: ['开放市场', 'Open Market'],
    shoutInfo: ['报价信息', 'Shout Info'],
    price: ['价格', 'Price'],
    unitIndex: ['物品序号', 'UnitIndex'],
    buyOrders: ['买家订单', 'Buy Order'],
    sellOrders: ['卖家订单', 'Sell Order'],
    position: ['玩家编号', 'Player Seq'],
    role: ['角色', 'Role'],
    marketClosed: ['市场关闭', 'Market Closed'],
    readingInfo: ['阅览市场信息', 'Reading market information'],
    trading: ['交易中', 'Trading'],
    showResult: ['展示结果', 'Show result'],
    unknown: ['???', '???'],
    status: ['状态', 'Status'],
    wait4MarketOpen: ['等待市场开放', 'Waiting for market opening'],
    [ROLE[ROLE.Buyer]]: ['买家', 'Buyer'],
    [ROLE[ROLE.Seller]]: ['卖家', 'Seller']
  })

  state: IPlay4OwnerState = {}

  componentDidMount(): void {
    const { frameEmitter } = this.props
    if (!frameEmitter) {
      return null
    }
    frameEmitter.on(PushType.periodCountDown, ({ periodCountDown }) => {
      this.setState({ timer: periodCountDown })
    })
  }

  renderPlayerStatusTable() {
    const {
        lang,
        props: { game, playerStates }
      } = this,
      { positions } = game.params.phases[0].params
    return (
      <table className={style.playerStatusTable}>
        <tbody>
          <tr>
            <td>{lang.seatNumber}</td>
            <td>{lang.position}</td>
            <td>{lang.role}</td>
            <td>{lang.status}</td>
          </tr>
          {Object.values(playerStates)
            .sort(({ positionIndex: p1 }, { positionIndex: p2 }) => p1 - p2)
            .map(({ phases, positionIndex, seatNumber, status }, i) => (
              <tr key={i}>
                <td>{seatNumber || lang.unknown}</td>
                <td>{positionIndex === undefined ? lang.unknown : positionIndex + 1}</td>
                <td>
                  {positions[positionIndex] === undefined ? lang.unknown : lang[ROLE[positions[positionIndex].role]]}
                </td>
                <td>{status === PlayerStatus.wait4MarketOpen ? lang.wait4MarketOpen : ''}</td>
              </tr>
            ))}
        </tbody>
      </table>
    )
  }

  renderAssignPosition() {
    const {
      lang,
      props: { frameEmitter, gameState, playerStates, game }
    } = this
    const totalPlayer = game.params.phases.find(ph => ph.templateName === phaseNames.assignPosition).params.positions
      .length
    return (
      <section className={style.assignPosition}>
        {this.renderPlayerStatusTable()}
        <div className={style.btnWrapper}>
          <div className={style.inGameNum}>
            进入实验人数: {Object.keys(playerStates).length}/{totalPlayer}
          </div>
          {gameState.positionAssigned ? (
            <Button
              {...{
                label: lang.openMarket,
                onClick: () => frameEmitter.emit(MoveType.openMarket)
              }}
            />
          ) : (
            <Button
              {...{
                label: lang.assignPosition,
                onClick: () => frameEmitter.emit(MoveType.assignPosition)
              }}
            />
          )}
        </div>
      </section>
    )
  }

  renderMainGame() {
    const {
      lang,
      props: { game, gameState },
      state: { timer }
    } = this
    const { gamePhaseIndex } = gameState
    const { time2ReadInfo, durationOfEachPeriod } = game.params.phases[gamePhaseIndex].params,
      { trades, sellOrderIds, buyOrderIds } = gameState.phases[gamePhaseIndex]
    const orderDict: { [id: number]: GameState.IOrder } = {}
    gameState.orders.forEach(order => {
      orderDict[order.id] = order
    })
    return (
      <section className={style.mainGame}>
        <div className={style.marketInfo}>
          <div className={style.orderList}>
            <ul>
              <label>{lang.buyOrders}</label>
              {buyOrderIds.map(orderId => (
                <li key={orderId}>{orderDict[orderId].price}</li>
              ))}
            </ul>
            <ul>
              <label>{lang.sellOrders}</label>
              {sellOrderIds.map(orderId => (
                <li key={orderId}>{orderDict[orderId].price}</li>
              ))}
            </ul>
          </div>
          <div className={style.countdownLabel}>
            {timer ? (
              timer < time2ReadInfo ? (
                <label>
                  {lang.readingInfo}
                  <em>{time2ReadInfo - timer}</em>s
                </label>
              ) : timer < +time2ReadInfo + +durationOfEachPeriod ? (
                <label>
                  {lang.trading}
                  <em>{+durationOfEachPeriod + +time2ReadInfo - timer}</em>s
                </label>
              ) : (
                <label>
                  {lang.showResult}
                  <em>{+durationOfEachPeriod + 2 * time2ReadInfo - timer}</em>s
                </label>
              )
            ) : null}
          </div>
        </div>
        <div className={style.chartPanel}>
          <div className={style.chartWrapper}>
            <TradeChart
              tradeList={trades.map(({ reqId }) => ({
                price: orderDict[reqId].price
              }))}
            />
          </div>
        </div>
      </section>
    )
  }

  renderMarket() {
    const {
      lang,
      props: {
        game,
        gameState: { gamePhaseIndex }
      }
    } = this
    const { templateName } = game.params.phases[gamePhaseIndex]
    switch (templateName) {
      case phaseNames.assignPosition:
        return this.renderAssignPosition()
      case phaseNames.mainGame:
        return (
          <React.Fragment>
            {this.renderPlayerStatusTable()}
            {this.renderMainGame()}
          </React.Fragment>
        )
      case phaseNames.marketResult:
        return <div className={style.blankMsg}>{lang.marketClosed}</div>
    }
  }

  render() {
    return <section className={style.player4Owner}>{this.renderMarket()}</section>
  }
}
