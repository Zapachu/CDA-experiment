import {BaseRobot} from '@bespoke/robot';
import {
    BuyNumberRange,
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
    PushType
} from './config';
import {formatDigits, genRandomInt} from './Controller';

function genPriceAndNum(
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

export default class extends BaseRobot<ICreateParams,
    IGameState,
    IPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams> {
  timer: NodeJS.Timer

  get gameRoundState() {
    return this.gameState.rounds[this.gameState.round]
  }

  get playerRoundState() {
    return this.playerState.rounds[this.gameState.round]
  }

  async init(): Promise<this> {
    await super.init()
    this.frameEmitter.on(PushType.startRound, () => {
      setTimeout(() => {
        if (!this.playerState) {
          return
        }
        const {startMoney, privateValue} = this.playerRoundState, {minPrice} = this.gameRoundState
        const {price, bidNum} = genPriceAndNum(minPrice, privateValue, startMoney)
        this.frameEmitter.emit(MoveType.shout, {price, num: bidNum})
      }, 3e3 * Math.random() + 2e3)
    })
    setTimeout(() => this.frameEmitter.emit(MoveType.getIndex), 1e3)
    return this
  }
}
