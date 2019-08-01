import {BaseRobot} from '@bespoke/robot'
import {maxNPCNum, minNPCNum, MoveType, PushType} from './config'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
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
    this.frameEmitter.on(PushType.robotShout, ({min, max, startingPrice}) => {
      const {price, bidNum} = this.genPriceAndNum(min, max, startingPrice)
      this.frameEmitter.emit(MoveType.shout, {price, num: bidNum})
    })
    setTimeout(() => {
      this.frameEmitter.emit(MoveType.getIndex)
    }, 1100)
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
