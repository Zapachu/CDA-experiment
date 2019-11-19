import { NCreateParams } from '@micro-experiment/share'
import { GameStatus } from '@bespoke/server'
import { BaseRobot } from '@bespoke/robot'
import {
  AdjustDirection,
  ICreateParams,
  Identity,
  IGamePeriodState,
  IGameState,
  IMoveParams,
  IOrder,
  IPlayerState,
  IPushParams,
  MoveType,
  PERIOD,
  PeriodStage,
  PrivatePriceRegion,
  PushType,
  ROLE
} from './config'

export default class Robot extends BaseRobot<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  normalSleepLoop: NodeJS.Timer
  normalSleepTime = this.game.params.robotCD * 1e3 * (0.5 + Math.random())
  zipSleepTime = this.game.params.robotCD * 1e3 * (1 + Math.random())
  zipActive: boolean
  zipFreeField: {
    beta: number
    r: number
    Gamma: number
    u: number
    calcPrice?: number
  }
  gdSleepTime = this.game.params.robotCD * 1e3 * (1 + Math.random())

  //region getter
  get zipRole(): ROLE {
    const [[min, max]] = PrivatePriceRegion[this.gameState.type]
    return this.unitPrice > (min + max) / 2 ? ROLE.Buyer : ROLE.Seller
  }

  get gamePhaseState(): IGamePeriodState {
    return this.gameState.periods[this.gameState.periodIndex]
  }

  get orderDict(): { [id: number]: IOrder } {
    const orderDict: { [id: number]: IOrder } = {}
    this.gamePhaseState.orders.forEach(order => {
      orderDict[order.id] = order
    })
    return orderDict
  }

  get unitPrice(): number {
    return this.playerState.privatePrices[this.gameState.periodIndex]
  }

  //endregion

  static formatPrice(price: number) {
    return Math.round(price)
  }

  async init(): Promise<this> {
    await super.init()
    switch (this.game.params.robotType) {
      case NCreateParams.CBMRobotType.normal:
        return this.normalInit()
      case NCreateParams.CBMRobotType.zip:
        return this.zipInit()
      case NCreateParams.CBMRobotType.gd:
        return this.gdInit()
    }
  }

  //region Normal
  async normalInit(): Promise<this> {
    setTimeout(() => this.frameEmitter.emit(MoveType.getIndex), 1000)
    this.frameEmitter.on(PushType.beginTrading, () => {
      global.setInterval(() => {
        if (
          this.gameState.periodIndex === PERIOD - 1 &&
          this.gameState.periods[this.gameState.periodIndex].stage === PeriodStage.result
        ) {
          global.clearInterval(this.normalSleepLoop)
        }
        if (this.gameState.status !== GameStatus.started) {
          return
        }
        this.normalWakeUp()
      }, this.normalSleepTime)
    })
    return this
  }

  normalWakeUp(): void {
    if (!this.playerState || !this.gameState) {
      return
    }
    const { stage, orders, sellOrderIds, buyOrderIds } = this.gameState.periods[this.gameState.periodIndex]
    if (stage !== PeriodStage.trading) {
      return
    }
    const privatePrice = this.playerState.privatePrices[this.gameState.periodIndex]
    const role = {
      [Identity.stockGuarantor]: ROLE.Buyer,
      [Identity.moneyGuarantor]: ROLE.Seller,
      [Identity.retailPlayer]: Math.random() > 0.5 ? ROLE.Seller : ROLE.Buyer
    }[this.playerState.identity]
    const price = privatePrice + ~~(Math.random() * 10 * (role === ROLE.Seller ? 1 : -1))
    const maxCount = role === ROLE.Seller ? this.playerState.count : this.playerState.money / privatePrice
    if (maxCount < 1) {
      return
    }
    const marketRejected =
      role === ROLE.Seller
        ? sellOrderIds[0] && price > orders.find(({ id }) => id === sellOrderIds[0]).price
        : buyOrderIds[0] && price < orders.find(({ id }) => id === buyOrderIds[0]).price
    if (marketRejected) {
      return
    }
    const count = ~~(maxCount * (0.3 * Math.random() + 0.2)) + 1
    this.frameEmitter.emit(MoveType.submitOrder, {
      price,
      count: count > 100 ? 100 : count,
      role
    })
  }

  //endregion

  //region ZIP
  async zipInit(): Promise<this> {
    setTimeout(() => this.frameEmitter.emit(MoveType.getIndex), 1000)
    this.zipActive = false
    setTimeout(() => {
      const u = (this.zipRole === ROLE.Seller ? 1 : -1) * (0.05 + 0.3 * Math.random()),
        calcPrice = Robot.formatPrice(this.unitPrice * (1 + u))
      this.zipActive = true
      this.zipFreeField = {
        beta: 0.1 + 0.4 * Math.random(),
        r: 0.1 * Math.random(),
        Gamma: 0,
        u,
        calcPrice
      }
      setTimeout(() => this.zipWakeUp(), this.zipSleepTime)
    }, this.zipSleepTime)
    this.frameEmitter.on(PushType.newOrder, ({ newOrderId }) => {
      if (!this.zipActive) {
        return
      }
      if (this.playerState.playerIndex === this.orderDict[newOrderId].playerIndex) {
        this.zipRespondNewOrder(newOrderId)
      }
    })
    this.frameEmitter.on(PushType.newTrade, ({ resOrderId }) => {
      if (!this.zipActive) {
        return
      }
      this.zipRespondNewTrade(resOrderId)
    })
    return this
  }

  zipWakeUp(): void {
    this.zipSubmitOrder()
    setTimeout(() => this.zipWakeUp(), this.zipSleepTime)
  }

  zipRespondNewOrder(newOrderId: number) {
    const {
        orderDict,
        zipRole,
        zipFreeField: { calcPrice }
      } = this,
      newOrder = orderDict[newOrderId]
    const newOrderRole = newOrder.role
    if (
      newOrderRole === zipRole &&
      ((zipRole === ROLE.Buyer && calcPrice <= newOrder.price) ||
        (zipRole === ROLE.Seller && calcPrice >= newOrder.price))
    ) {
      this.zipAdjustProfitRate(AdjustDirection.lower, newOrder.price)
    }
  }

  zipRespondNewTrade(resOrderId: number) {
    const { orderDict, zipRole } = this
    const { reqOrderId } = this.gamePhaseState.trades.find(t => t.resOrderId === resOrderId),
      { price: tradePrice, role: resRole } = orderDict[reqOrderId]
    if (
      (zipRole === ROLE.Buyer && this.zipFreeField.calcPrice >= tradePrice) ||
      (zipRole === ROLE.Seller && this.zipFreeField.calcPrice <= tradePrice)
    ) {
      this.zipAdjustProfitRate(AdjustDirection.raise, tradePrice)
    } else if (resRole !== zipRole) {
      this.zipAdjustProfitRate(AdjustDirection.lower, tradePrice)
    }
  }

  zipAdjustProfitRate(adjustDirection: AdjustDirection, q: number): void {
    const { zipRole, unitPrice } = this
    const prePrice = this.zipFreeField.calcPrice || unitPrice * (1 + this.zipFreeField.u)
    const { beta, r, Gamma } = this.zipFreeField
    const tmp = (adjustDirection === AdjustDirection.raise ? 0.05 : -0.05) * (zipRole === ROLE.Seller ? 1 : -1),
      R = 1 + Math.random() * tmp,
      A = Math.random() * tmp
    const tau = R * q + A,
      delta = beta * (tau - prePrice)
    this.zipFreeField.Gamma = Gamma * r + (1 - r) * delta
    let newPrice = Robot.formatPrice(prePrice + this.zipFreeField.Gamma)
    const priceOverflow = {
      [ROLE.Seller]: newPrice < unitPrice,
      [ROLE.Buyer]: newPrice > unitPrice
    }[zipRole]
    if (priceOverflow) {
      newPrice = unitPrice
    }
    if (newPrice !== prePrice) {
      this.zipFreeField.calcPrice = newPrice
    }
  }

  zipSubmitOrder(): void {
    const {
      zipFreeField: { calcPrice },
      gamePhaseState: { buyOrderIds, sellOrderIds },
      orderDict,
      unitPrice
    } = this
    const [wouldBeRejected, rejectPrice] = {
      [ROLE.Seller]: sellOrderIds[0]
        ? [calcPrice >= orderDict[sellOrderIds[0]].price, orderDict[sellOrderIds[0]].price]
        : [],
      [ROLE.Buyer]: buyOrderIds[0]
        ? [calcPrice <= orderDict[buyOrderIds[0]].price, orderDict[buyOrderIds[0]].price]
        : []
    }[this.zipRole] as [boolean, number]
    if (wouldBeRejected) {
      this.zipFreeField.calcPrice = calcPrice
      this.zipAdjustProfitRate(AdjustDirection.lower, rejectPrice)
      return
    }
    this.zipFreeField.u = calcPrice / this.unitPrice - 1
    this.frameEmitter.emit(MoveType.submitOrder, {
      price: calcPrice,
      count: ~~(Math.random() * 40) + 10,
      role: this.zipRole
    })
  }

  //endregion

  //region GD
  async gdInit(): Promise<this> {
    setTimeout(() => this.frameEmitter.emit(MoveType.getIndex), 1e3)
    this.frameEmitter.on(PushType.beginTrading, () => {
      global.setInterval(() => {
        if (
          this.gameState.periodIndex === PERIOD - 1 &&
          this.gameState.periods[this.gameState.periodIndex].stage === PeriodStage.result
        ) {
          global.clearInterval(this.normalSleepLoop)
        }
        if (this.gameState.status !== GameStatus.started) {
          return
        }
        this.normalWakeUp()
      }, this.gdSleepTime)
    })
    return this
  }

  //endregion
}
