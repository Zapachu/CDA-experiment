import { GameStatus, Model, redisClient } from '@bespoke/server'
import { BaseRobot } from '@bespoke/robot'
import {
  AdjustDirection,
  DBKey,
  IDENTITY,
  MarketStage,
  MoveType,
  orderNumberLimit,
  phaseNames,
  PushType,
  ReactionType,
  RedisKey,
  RobotCalcLog,
  RobotSubmitLog,
  ROLE,
  ShoutResult
} from './config'
import { IPoint, pointPair2Curve } from './util'
import { CreateParams, GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams } from './interface'
import dateFormat = require('dateformat')

export default class Robot extends BaseRobot<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  periodCountDown = 0

  async init(): Promise<this> {
    await super.init()
    this.frameEmitter.on(PushType.assignedPosition, () => {
      setTimeout(
        () =>
          this.frameEmitter.emit(MoveType.enterMarket, {
            seatNumber: ~~(Math.random() * 10000)
          }),
        Math.random() * 3000
      )
    })
    this.frameEmitter.on(PushType.periodCountDown, ({ periodCountDown }) => {
      this.periodCountDown = periodCountDown
    })
    this.frameEmitter.on(PushType.periodOpen, () => {
      const { positions } = this.game.params.phases[0].params,
        { positionIndex } = this.playerState,
        position = { ...positions[positionIndex] }
      switch (position.identity) {
        case IDENTITY.ZipRobot:
          new ZipRobot(this).init()
          break
        case IDENTITY.GDRobot:
          new GDRobot(this).init()
          break
      }
    })
    return this
  }
}

class CDARobot {
  constructor(private host: Robot) {}

  get periodCountDown(): number {
    return this.host.periodCountDown
  }

  get game() {
    return this.host.game
  }

  get phaseParams(): CreateParams.Phase.IParams {
    return this.host.game.params.phases[this.gameState.gamePhaseIndex].params
  }

  get gameState() {
    return this.host.gameState
  }

  get playerState() {
    return this.host.playerState
  }

  get frameEmitter() {
    return this.host.frameEmitter
  }

  get gamePhaseState(): GameState.IGamePhaseState {
    return this.gameState.phases[this.gameState.gamePhaseIndex]
  }

  get orderDict(): { [id: number]: GameState.IOrder } {
    const orderDict: { [id: number]: GameState.IOrder } = {}
    this.gameState.orders.forEach(order => {
      orderDict[order.id] = order
    })
    return orderDict
  }

  get unitIndex(): number {
    return this.gamePhaseState.positionUnitIndex[this.playerState.positionIndex]
  }

  get unitPrice(): number {
    return this.unitPrices[this.unitIndex] || 0
  }

  get unitPrices(): Array<number> {
    const {
      gameState: { gamePhaseIndex },
      playerState: { unitLists }
    } = this
    return unitLists[gamePhaseIndex].split(' ').map(p => +p)
  }

  get position(): CreateParams.Phase.Params.IPosition {
    const { positions } = this.game.params.phases[0].params,
      { positionIndex } = this.playerState,
      position = { ...positions[positionIndex] }
    position.interval = 1000 * position.interval
    return position
  }

  getPosition(index: number): CreateParams.Phase.Params.IPosition {
    const { positions } = this.game.params.phases[0].params
    return positions[index]
  }

  formatPrice(price: number) {
    return Math.round(price)
  }

  async init(): Promise<CDARobot> {
    return this
  }

  buildRobotSubmitLog(seq: number, price: number): Partial<RobotSubmitLog> {
    const {
      unitIndex,
      unitPrice,
      gamePhaseState: { buyOrderIds, sellOrderIds },
      orderDict
    } = this
    return {
      seq,
      playerSeq: this.playerState.positionIndex + 1,
      unitIndex,
      role: ROLE[this.position.role],
      ValueCost: unitPrice,
      price,
      buyOrders: buyOrderIds.map(id => orderDict[id].price).join(','),
      sellOrders: sellOrderIds.map(id => orderDict[id].price).join(','),
      timestamp: dateFormat(Date.now(), 'HH:MM:ss:l')
    }
  }

  wouldBeRejected(price: number): [boolean, number] {
    const {
      gamePhaseState: { buyOrderIds, sellOrderIds },
      orderDict
    } = this
    const [wouldBeRejected = false, rejectPrice] = {
      [ROLE.Seller]: sellOrderIds[0]
        ? [price >= orderDict[sellOrderIds[0]].price, orderDict[sellOrderIds[0]].price]
        : [],
      [ROLE.Buyer]: buyOrderIds[0] ? [price <= orderDict[buyOrderIds[0]].price, orderDict[buyOrderIds[0]].price] : []
    }[this.position.role]
    return [wouldBeRejected, rejectPrice]
  }
}

interface IZipFreeField {
  beta: number
  r: number
  Gamma: number
  u: number
  calcPrice?: number
}

class ZipRobot extends CDARobot {
  zipActive: boolean
  zipFreeField: IZipFreeField

  get sleepTime(): number {
    return this.position.interval * (0.75 + 0.5 * Math.random())
  }

  async init(): Promise<this> {
    await super.init()
    this.frameEmitter.on(PushType.newOrder, ({ newOrderId }) => {
      if (!this.zipActive) {
        return
      }
      if (
        this.position.reactionType === ReactionType.TradeAndOrder ||
        this.playerState.positionIndex === this.orderDict[newOrderId].positionIndex
      ) {
        this.respondNewOrder(newOrderId)
      }
    })
    this.frameEmitter.on(PushType.newTrade, ({ resOrderId }) => {
      if (!this.zipActive) {
        return
      }
      this.respondNewTrade(resOrderId)
    })
    this.zipActive = false
    setTimeout(() => {
      const u = (this.position.role === ROLE.Seller ? 1 : -1) * (0.05 + 0.3 * Math.random()),
        calcPrice = this.formatPrice(this.unitPrice * (1 + u))
      this.zipActive = true
      this.zipFreeField = {
        beta: 0.1 + 0.4 * Math.random(),
        r: 0.1 * Math.random(),
        Gamma: 0,
        u,
        calcPrice
      }
      setTimeout(() => this.wakeUp(), this.sleepTime)
    }, this.game.params.phases[this.gameState.gamePhaseIndex].params.startTime[this.playerState.positionIndex])
    return this
  }

  wakeUp(): void {
    if (
      this.game.params.phases[this.gameState.gamePhaseIndex].templateName === phaseNames.mainGame &&
      this.gamePhaseState.marketStage === MarketStage.trading &&
      this.unitPrice
    ) {
      redisClient.incr(RedisKey.robotActionSeq(this.game.id)).then(seq => this.submitOrder(seq))
      setTimeout(() => this.wakeUp(), this.sleepTime)
    }
  }

  respondNewOrder(newOrderId: number) {
    const {
        orderDict,
        game,
        position: { role },
        zipFreeField: { calcPrice }
      } = this,
      newOrder = orderDict[newOrderId],
      { positions } = game.params.phases[0].params
    const { role: newOrderRole } = positions[newOrder.positionIndex]
    if (
      newOrderRole === role &&
      ((role === ROLE.Buyer && calcPrice <= newOrder.price) || (role === ROLE.Seller && calcPrice >= newOrder.price))
    ) {
      this.adjustProfitRate(AdjustDirection.lower, newOrder.price)
    }
  }

  respondNewTrade(resOrderId: number) {
    const {
        orderDict,
        game,
        position: { role }
      } = this,
      resOrder = orderDict[resOrderId],
      { positions } = game.params.phases[0].params
    const { reqId } = this.gamePhaseState.trades.find(({ resId }) => resId === resOrderId),
      { price: tradePrice } = orderDict[reqId]
    const resRole = positions[resOrder.positionIndex].role
    if (
      (role === ROLE.Buyer && this.zipFreeField.calcPrice >= tradePrice) ||
      (role === ROLE.Seller && this.zipFreeField.calcPrice <= tradePrice)
    ) {
      this.adjustProfitRate(AdjustDirection.raise, tradePrice)
    } else if (resRole !== role) {
      this.adjustProfitRate(AdjustDirection.lower, tradePrice)
    }
  }

  adjustProfitRate(adjustDirection: AdjustDirection, q: number): void {
    const {
      position: { role },
      unitPrice,
      unitIndex
    } = this
    const prePrice = this.zipFreeField.calcPrice || unitPrice * (1 + this.zipFreeField.u)
    const { beta, r, Gamma } = this.zipFreeField
    const tmp = (adjustDirection === AdjustDirection.raise ? 0.05 : -0.05) * (role === ROLE.Seller ? 1 : -1),
      R = 1 + Math.random() * tmp,
      A = Math.random() * tmp
    const tau = R * q + A,
      delta = beta * (tau - prePrice)
    this.zipFreeField.Gamma = Gamma * r + (1 - r) * delta
    let newPrice = this.formatPrice(prePrice + this.zipFreeField.Gamma)
    const priceOverflow = {
      [ROLE.Seller]: newPrice < unitPrice,
      [ROLE.Buyer]: newPrice > unitPrice
    }[role]
    if (priceOverflow) {
      newPrice = unitPrice
    }
    if (newPrice !== prePrice) {
      this.zipFreeField.calcPrice = newPrice
      redisClient.incr(RedisKey.robotActionSeq(this.game.id)).then(async seq => {
        const data: RobotCalcLog = {
          seq,
          playerSeq: this.playerState.positionIndex + 1,
          unitIndex,
          role: ROLE[this.position.role],
          R,
          A,
          q,
          tau,
          beta,
          p: prePrice,
          delta,
          r,
          LagGamma: Gamma,
          Gamma: this.zipFreeField.Gamma,
          ValueCost: unitPrice,
          u: newPrice / unitPrice - 1,
          CalculatedPrice: newPrice,
          timestamp: dateFormat(Date.now(), 'HH:MM:ss:l')
        }
        await new Model.FreeStyleModel({
          game: this.game.id,
          key: DBKey.robotCalcLog,
          data
        }).save()
      })
    }
  }

  submitOrder(seq: number): void {
    const {
      zipFreeField: { calcPrice },
      gameState: { gamePhaseIndex },
      unitIndex
    } = this
    const [wouldBeRejected, rejectPrice] = this.wouldBeRejected(calcPrice)
    if (wouldBeRejected) {
      this.zipFreeField.calcPrice = calcPrice
      this.adjustProfitRate(AdjustDirection.lower, rejectPrice)
      return
    }
    this.zipFreeField.u = calcPrice / this.unitPrice - 1
    const data = this.buildRobotSubmitLog(seq, calcPrice)
    this.frameEmitter.emit(
      MoveType.submitOrder,
      {
        price: calcPrice,
        unitIndex,
        gamePhaseIndex
      },
      async (shoutResult: ShoutResult, marketBuyOrders, marketSellOrders) => {
        await new Model.FreeStyleModel({
          game: this.game.id,
          key: DBKey.robotSubmitLog,
          data: { ...data, shoutResult, marketBuyOrders, marketSellOrders }
        }).save()
      }
    )
  }
}

interface ICurveFragment {
  from: number
  to: number
  curve: (price: number) => number
}

interface ICalcPkg {
  unitIndex?: number
  price?: number
  e?: number
  sleepTime: number
}

class GDRobot extends CDARobot {
  alpha = 0.95
  beta = 250e3
  defaultSleepTime = 5e3

  async init(): Promise<this> {
    await super.init()
    global.setTimeout(() => this.sleepLoop(), Math.random() * 5e3)
    return this
  }

  sleepLoop() {
    const playing =
      this.gameState.status === GameStatus.started &&
      this.game.params.phases[this.gameState.gamePhaseIndex].templateName === phaseNames.mainGame &&
      this.gamePhaseState.marketStage === MarketStage.trading &&
      this.unitPrice
    if (!playing) {
      return
    }
    const calcPkg = this.calc()
    setTimeout(() => {
      redisClient.incr(RedisKey.robotActionSeq(this.game.id)).then(seq => {
        if (calcPkg.price !== undefined) {
          this.submitOrder(seq, calcPkg)
        }
        this.sleepLoop()
      })
    }, calcPkg.sleepTime)
  }

  getM() {
    let M = 0
    for (const price of this.unitPrices) {
      price > M ? (M = price) : null
    }
    return ~~Math.pow(2, 1.5 + ~~Math.log2(M))
  }

  getExpectationCurve(): [GameState.IOrder[], ICurveFragment[]] {
    const {
        gameState: { orders, gamePhaseIndex },
        gamePhaseState: { trades, buyOrderIds, sellOrderIds },
        orderDict
      } = this,
      recentTrades = trades.slice(-5),
      recentReqOrders = recentTrades.map(({ reqId }) => reqId),
      recentResOrders = recentTrades.map(({ resId }) => resId),
      recentTopBuyOrders = recentTrades.map(({ topBuyOrderId }) => topBuyOrderId),
      recentTopSellOrders = recentTrades.map(({ topSellOrderId }) => topSellOrderId),
      M = this.getM()
    let anchorPoints: Array<IPoint> =
      this.position.role === ROLE.Seller
        ? [
            { x: 0, y: 1 },
            { x: M, y: 0 }
          ]
        : [
            { x: 0, y: 0 },
            { x: M, y: 1 }
          ]
    const markedOrderId = recentResOrders.length === 5 ? recentResOrders[0] : orderNumberLimit * gamePhaseIndex,
      historyOrder = orders.filter(
        ({ id }) =>
          (id > markedOrderId && !recentResOrders.includes(id)) ||
          recentTopBuyOrders.includes(id) ||
          recentTopSellOrders.includes(id)
      )
    historyOrder.map(({ price }) => {
      if (anchorPoints.some(p => p.x === price)) {
        return
      }
      let TA = 0,
        B = 0,
        TB = 0,
        ta = 0,
        tb = 0,
        a = 0
      for (const order of historyOrder) {
        const isSeller = this.getPosition(order.positionIndex).role === ROLE.Seller
        if (order.price >= price) {
          if (!isSeller) {
            B++
          }
          if (recentReqOrders.includes(order.id)) {
            isSeller ? TA++ : TB++
          }
        }
        if (order.price <= price) {
          if (isSeller) {
            a++
          }
          if (recentReqOrders.includes(order.id)) {
            isSeller ? ta++ : tb++
          }
        }
      }
      const y =
        this.position.role === ROLE.Seller
          ? sellOrderIds[0] && price >= orderDict[sellOrderIds[0]].price
            ? 0
            : (TA + B) / (TA + B + a - ta)
          : buyOrderIds[0] && price <= orderDict[buyOrderIds[0]].price
          ? 0
          : (tb + a) / (tb + a + B - TB)
      anchorPoints.push({ x: price, y })
    })
    anchorPoints = anchorPoints.sort((p1, p2) => p1.x - p2.x)
    return [
      historyOrder,
      anchorPoints.slice(1).map((p2, i) => {
        const p1 = anchorPoints[i]
        return {
          from: p1.x,
          to: p2.x,
          curve: pointPair2Curve(p1, p2)
        }
      })
    ]
  }

  getCurvesTopPoint(
    curves: Array<ICurveFragment>,
    f: number,
    t: number,
    coefficient: (price: number) => number
  ): { price: number; e: number } {
    const _curves = curves.filter(
      ({ from, to, curve }) => from < t && to > f && (curve(from) > Number.EPSILON || curve(to) > Number.EPSILON)
    )
    let targetFragment: ICurveFragment = null,
      maxE = 0,
      maxEPrice = f
    _curves.forEach(fragment => {
      const { from, to, curve } = fragment
      for (let price = from; price <= to; price++) {
        const e = coefficient(price) * curve(price)
        if (e > maxE) {
          maxE = e
          maxEPrice = price
          targetFragment = fragment
        }
      }
    })
    if (targetFragment) {
      const { unitPrice } = this,
        { from, to, curve } = targetFragment
      if (curve(from) < Number.EPSILON && curve(to) < Number.EPSILON && unitPrice >= from && unitPrice <= to) {
        maxEPrice = unitPrice
      }
    }
    return {
      price: maxEPrice,
      e: maxE
    }
  }

  calc(): ICalcPkg {
    const calcPkg: ICalcPkg = {
      sleepTime: this.defaultSleepTime
    }
    const {
      beta,
      alpha,
      gamePhaseState: { sellOrderIds, buyOrderIds },
      orderDict
    } = this
    const [historyOrders, curves] = this.getExpectationCurve()
    let f: number = null,
      t: number = null,
      profitSign = 1
    if (this.position.role === ROLE.Seller) {
      f = this.unitPrice
      t = sellOrderIds[0] ? orderDict[sellOrderIds[0]].price : curves[curves.length - 1].to
    } else {
      profitSign = -1
      f = buyOrderIds[0] ? orderDict[buyOrderIds[0]].price : curves[0].from
      t = this.unitPrice
    }
    if (f < t) {
      const { price, e } = this.getCurvesTopPoint(curves, f, t, price => (price - this.unitPrice) * profitSign)
      if (e > 0) {
        calcPkg.price = price
        calcPkg.unitIndex = this.unitIndex
        calcPkg.e = +e.toFixed(2)
        calcPkg.sleepTime = ~~(
          ((beta * (1 - (alpha * this.periodCountDown) / this.phaseParams.durationOfEachPeriod)) / calcPkg.e) *
          Math.log(1 / Math.random())
        )
      }
    }
    redisClient.incr(RedisKey.robotActionSeq(this.game.id)).then(async seq => {
      const data: RobotCalcLog = {
        seq,
        playerSeq: this.playerState.positionIndex + 1,
        unitIndex: this.unitIndex,
        role: ROLE[this.position.role],
        R: `(0,${curves[0].curve(0)})` + curves.map(({ to, curve }) => `(${to},${curve(to).toFixed(1)})`).join(','),
        A: 'BuyOrders:' + buyOrderIds.map(id => orderDict[id].price).join(','),
        q: 'SellOrders:' + sellOrderIds.map(id => orderDict[id].price).join(','),
        tau:
          'HistoryOrders:' +
          historyOrders
            .map(
              ({ unitIndex, positionIndex, price }) =>
                `box:${unitIndex + 1},role:${
                  this.getPosition(positionIndex).role === ROLE.Seller ? 'S' : 'B'
                }, price:${price}`
            )
            .join('/'),
        beta: `PrivateCost:${this.unitPrice}`,
        p: `Price:${calcPkg.price || '---'}`,
        delta: `E:${calcPkg.e || '---'}`,
        r: `Sleep:${calcPkg.sleepTime}`,
        LagGamma: `Time:${dateFormat(Date.now(), 'HH:MM:ss:l')}`,
        Gamma: ``,
        ValueCost: ``,
        u: ``,
        CalculatedPrice: ``,
        timestamp: ``
      }
      await new Model.FreeStyleModel({
        game: this.game.id,
        key: DBKey.robotCalcLog,
        data
      }).save()
    })
    return calcPkg
  }

  submitOrder(seq: number, calcPkg: ICalcPkg): void {
    const {
      gameState: { gamePhaseIndex }
    } = this
    if (!calcPkg) {
      return
    }
    if (calcPkg.unitIndex !== this.unitIndex) {
      return
    }
    if (this.wouldBeRejected(calcPkg.price)[0]) {
      return
    }
    const data = this.buildRobotSubmitLog(seq, calcPkg.price)
    this.frameEmitter.emit(
      MoveType.submitOrder,
      {
        price: calcPkg.price,
        unitIndex: calcPkg.unitIndex,
        gamePhaseIndex
      },
      async (shoutResult: ShoutResult, marketBuyOrders, marketSellOrders) => {
        await new Model.FreeStyleModel({
          game: this.game.id,
          key: DBKey.robotSubmitLog,
          data: { ...data, shoutResult, marketBuyOrders, marketSellOrders }
        }).save()
      }
    )
  }
}
