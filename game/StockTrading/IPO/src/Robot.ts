import {BaseRobot} from '@bespoke/robot'
import {
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  maxNPCNum,
  minNPCNum,
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
      const {startingPrice, privateValue} = this.playerState, {min} = this.gameState
      const {price, bidNum} = this.genPriceAndNum(min, privateValue, startingPrice)
      this.frameEmitter.emit(MoveType.shout, {price, num: bidNum})
    }, 3e3 * Math.random() + 2e3)
    return this
  }

  genPriceAndNum(
      min: number,
      max: number,
      startingPrice: number
  ): { price: number; bidNum: number } {
    const price = formatDigits(genRandomInt(min * 100, max * 100) / 100)
    const maxNum = Math.floor(startingPrice / price)
    const num =
        genRandomInt(minNPCNum / 100, Math.min(maxNPCNum, maxNum) / 100) * 100
    return {price, bidNum: num}
  }
}
