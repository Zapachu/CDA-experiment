import {BaseRobot} from '@bespoke/robot'
import {
  BuyNumberRange,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  PushType
} from './config'
import {formatDigits, genRandomInt} from './Controller'

export default class extends BaseRobot<ICreateParams,
    IGameState,
    IPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams> {
  async init(): Promise<this> {
    await super.init()
    setTimeout(() => this.frameEmitter.emit(MoveType.getIndex), 1e3)
    setTimeout(() => {
      if (!this.playerState) {
        return
      }
      const {startMoney, privateValue} = this.playerState, {minPrice} = this.gameState
      const {price, bidNum} = this.genPriceAndNum(minPrice, privateValue, startMoney)
      this.frameEmitter.emit(MoveType.shout, {price, num: bidNum})
    }, 3e3 * Math.random() + 2e3)
    return this
  }

  genPriceAndNum(
      min: number,
      max: number,
      startMoney: number
  ): { price: number; bidNum: number } {
    const price = formatDigits(genRandomInt(min * 100, max * 100) / 100)
    const maxNum = Math.floor(startMoney / price)
    const num =
        genRandomInt(BuyNumberRange.robotMin / 100, Math.min(BuyNumberRange.robotMax, maxNum) / 100) * 100
    return {price, bidNum: num}
  }
}
