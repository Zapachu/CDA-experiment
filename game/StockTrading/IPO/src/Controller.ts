import {BaseController, IActor, IMoveCallback, RedisCall, TGameState, TPlayerState} from '@bespoke/server'
import {
  ICreateParams,
  IGameState,
  IMoveParams,
  InvestorState,
  IPlayerState,
  IPushParams,
  MarketState
} from './interface'
import {
  IPOType,
  maxA,
  maxB,
  minA,
  minB,
  MoveType,
  PlayerStatus,
  PushType,
  SHOUT_TIMER,
  startingMultiplier
} from './config'
import {Phase, phaseToNamespace, STOCKS} from '@bespoke-game/stock-trading-config'
import {Trial} from '@elf/protocol'

export function genRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function formatDigits(num: number): number {
  return +num.toFixed(2)
}

export default class Controller extends BaseController<ICreateParams,
    IGameState,
    IPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams> {
  private shoutInterval: NodeJS.Timer

  static invalidParams(
      params: IMoveParams,
      privateValue: number,
      min: number,
      startingPrice: number
  ): string {
    if (params.num <= 0 || params.price * params.num > startingPrice) {
      return '您购买的股票数量超过您的可购买数量'
    }
    if (params.price < min || params.price > privateValue) {
      return `价格应在${min}与${privateValue}之间`
    }
    return ''
  }

  static findBuyerIndex(num: number, array: Array<number>): number {
    let lo = 0
    let hi = array.length - 1
    while (lo < hi) {
      const mid = Math.floor((hi - lo) / 2 + lo)
      if (array[mid] === num) {
        return mid
      } else if (num > array[mid]) {
        lo = mid + 1
      } else {
        if (mid === 0 || num > array[mid - 1]) {
          return mid
        }
        hi = mid - 1
      }
    }
    return lo
  }

  static genStartingPrice(min: number): number {
    const original = min * startingMultiplier
    const int = Math.floor(original / 10000)
    const remainder = original % 10000
    if (remainder > 0) {
      return formatDigits((int + 1) * 10000)
    }
    return formatDigits(original)
  }

  initGameState(): TGameState<IGameState> {
    const gameState = super.initGameState()
    const max = formatDigits(genRandomInt(minA * 100, maxA * 100) / 100),
        min = formatDigits((max * genRandomInt(minB * 100, maxB * 100)) / 100)
    gameState.playerNum = 0
    gameState.min = min
    gameState.max = max
    gameState.stockIndex = genRandomInt(0, STOCKS.length - 1)
    return gameState
  }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const gameState = await this.stateManager.getGameState()
    const playerState = await super.initPlayerState(actor)
    playerState.playerStatus = PlayerStatus.guide
    playerState.privateValue = formatDigits(genRandomInt(gameState.min * 100, gameState.max * 100) / 100)
    playerState.startingPrice = Controller.genStartingPrice(gameState.min)
    return playerState
  }

  async startTrade() {
    const gameState = await this.stateManager.getGameState()
    global.setTimeout(() => {
      const shoutIntervals = this.shoutInterval
      let shoutTimer = 1
      this.shoutInterval = global.setInterval(async () => {
        const playerStates = await this.stateManager.getPlayerStates(),
            playerStatesArray = Object.values(playerStates)
        this.push(playerStatesArray.map(({actor}) => actor), PushType.shoutTimer, {shoutTimer})
        if (
            playerStatesArray.every(s => s.playerStatus !== PlayerStatus.prepared)
        ) {
          global.clearInterval(shoutIntervals)
          return
        }
        if (shoutTimer++ < SHOUT_TIMER) {
          return
        }
        global.clearInterval(shoutIntervals)
        this._autoProcessProfits(gameState, playerStatesArray)
        await this.stateManager.syncState()
      }, 1000)
    }, 0)
  }

  _processMedianProfits(
      marketState: MarketState,
      sortedPlayerStates: Array<InvestorState>
  ) {
    const {total} = this.game.params
    const numberOfShares = sortedPlayerStates.reduce(
        (acc, item) => acc + item.bidNum,
        0
    )
    // 市场总数小于发行股数
    if (numberOfShares <= total) {
      marketState.strikePrice = marketState.min
      sortedPlayerStates
      // .filter(s => s.privateValue !== undefined)
          .forEach(s => {
            s.actualNum = s.bidNum
            s.profit = formatDigits(
                (s.privateValue - marketState.strikePrice) * s.actualNum
            )
          })
      return
    }
    const buyers: Array<InvestorState> = []
    const buyerLimits: Array<number> = []
    const median = Math.floor(numberOfShares / 2)
    let leftNum = median
    let buyerTotal = 0
    for (let i = 0; i < sortedPlayerStates.length; i++) {
      const curPlayer = sortedPlayerStates[i]
      buyerTotal += curPlayer.bidNum
      buyers.push(curPlayer)
      buyerLimits.push(curPlayer.bidNum + median - leftNum)
      if (curPlayer.bidNum >= leftNum) {
        marketState.strikePrice = curPlayer.price
        break
      }
      leftNum -= curPlayer.bidNum
    }
    // 买家总数小于发行股数
    if (buyerTotal <= total) {
      buyers
      // .filter(s => s.privateValue !== undefined)
          .forEach(s => {
            s.actualNum = s.bidNum
            s.profit = formatDigits(
                (s.privateValue - marketState.strikePrice) * s.actualNum
            )
          })
    } else {
      // 抽签分配
      buyers.forEach(s => (s.actualNum = 0))
      let count = 0
      while (count++ < total) {
        const random = genRandomInt(1, buyerTotal)
        const buyerIndex = Controller.findBuyerIndex(random, buyerLimits)
        buyers[buyerIndex].actualNum++
      }
      buyers
      // .filter(s => s.privateValue !== undefined)
          .forEach(s => {
            s.profit = formatDigits(
                (s.privateValue - marketState.strikePrice) * s.actualNum
            )
          })
    }
  }

  _processTopKProfits(
      marketState: MarketState,
      sortedPlayerStates: Array<InvestorState>
  ) {
    const {total} = this.game.params
    const buyers = []
    let strikePrice
    let leftNum = total
    for (let i = 0; i < sortedPlayerStates.length; i++) {
      const curPlayer = sortedPlayerStates[i]
      curPlayer.actualNum =
          curPlayer.bidNum > leftNum ? leftNum : curPlayer.bidNum
      buyers.push(curPlayer)
      if (curPlayer.bidNum >= leftNum) {
        strikePrice = curPlayer.price
        break
      }
      leftNum -= curPlayer.bidNum
    }
    marketState.strikePrice =
        strikePrice === undefined ? marketState.min : strikePrice
    buyers
    // .filter(s => s.privateValue !== undefined)
        .forEach(s => {
          s.profit = formatDigits(
              (s.privateValue - marketState.strikePrice) * s.actualNum
          )
        })
  }

  _processFPSBAProfits(
      marketState: MarketState,
      sortedPlayerStates: Array<InvestorState>
  ) {
    const {total} = this.game.params
    const buyers = []
    let strikePrice
    let leftNum = total
    for (let i = 0; i < sortedPlayerStates.length; i++) {
      const curPlayer = sortedPlayerStates[i]
      curPlayer.actualNum =
          curPlayer.bidNum > leftNum ? leftNum : curPlayer.bidNum
      buyers.push(curPlayer)
      if (curPlayer.bidNum >= leftNum) {
        strikePrice = curPlayer.price
        break
      }
      leftNum -= curPlayer.bidNum
    }
    marketState.strikePrice =
        strikePrice === undefined ? marketState.min : strikePrice
    buyers
    // .filter(s => s.privateValue !== undefined)
        .forEach(s => {
          s.profit = formatDigits(
              (s.privateValue - marketState.strikePrice) * s.actualNum
          )
        })
  }

  processProfits(playerStates: Array<InvestorState>, marketState: MarketState) {
    const {type} = this.game.params
    const sortedPlayerStates = playerStates.sort((a, b) => b.price - a.price)
    switch (type) {
      case IPOType.FPSBA:
        this._processFPSBAProfits(marketState, sortedPlayerStates)
        break
      case IPOType.Median:
        this._processMedianProfits(marketState, sortedPlayerStates)
        break
      case IPOType.TopK:
        this._processTopKProfits(marketState, sortedPlayerStates)
        break
    }
  }

  _autoProcessProfits(
      group: IGameState,
      groupPlayerStates: Array<TPlayerState<IPlayerState>>
  ) {
    const investorStates = groupPlayerStates
        .filter(s => {
          if (s.playerStatus === PlayerStatus.prepared) {
            s.price = 0
            s.bidNum = 0
            s.actualNum = 0
            s.profit = 0
            return false
          }
          return true
        })
    this.processProfits(
        investorStates as Array<InvestorState>,
        group as MarketState
    )
    groupPlayerStates.forEach(s => (s.playerStatus = PlayerStatus.result))
  }

  protected async playerMoveReducer(
      actor: IActor,
      type: string,
      params: IMoveParams,
      cb: IMoveCallback
  ): Promise<void> {
    const {groupSize} = this.game.params
    const playerState = await this.stateManager.getPlayerState(actor),
        gameState = await this.stateManager.getGameState(),
        playerStates = await this.stateManager.getPlayerStates()
    switch (type) {
      case MoveType.guideDone: {
        playerState.playerStatus = PlayerStatus.test
        break
      }
      case MoveType.getIndex: {
        if (playerState.index !== undefined || gameState.playerNum === groupSize) {
          break
        }
        playerState.index = gameState.playerNum++
        playerState.playerStatus = PlayerStatus.prepared
        if (playerState.index === 0) {
          global.setTimeout(async () => {
            if (gameState.playerNum < groupSize) {
              Array(groupSize - gameState.playerNum).fill(null).forEach(async (_, i) => {
                await this.startRobot(i)
              })
            }
            await this.startTrade()
          }, 3e3)
        }
        break
      }
      case MoveType.shout: {
        if (playerState.playerStatus !== PlayerStatus.prepared) {
          return
        }
        const {privateValue, startingPrice} = playerState,
            {min} = gameState
        const errMsg = Controller.invalidParams(
            params,
            privateValue,
            min,
            startingPrice
        )
        if (errMsg) {
          return cb(errMsg)
        }
        playerState.playerStatus = PlayerStatus.shouted
        playerState.price = params.price
        playerState.bidNum = params.num
        const playerStatesArr = Object.values(playerStates)
        if (
            !playerStatesArr.every(s => s.playerStatus === PlayerStatus.shouted)
        ) {
          return
        }
        setTimeout(async () => {
          this.processProfits(
              playerStatesArr as Array<InvestorState>,
              gameState as MarketState
          )
          playerStatesArr.forEach(
              s => (s.playerStatus = PlayerStatus.result)
          )
          await this.stateManager.syncState()
        }, 2000)
        break
      }
      case MoveType.nextGame: {
        const playerStatus = playerState.playerStatus
        if (playerStatus !== PlayerStatus.result) {
          return
        }
        const {onceMore} = params
        const trialNamespace = {
          [IPOType.FPSBA]: Phase.IPO_FPSBA,
          [IPOType.Median]: Phase.IPO_Median,
          [IPOType.TopK]: Phase.IPO_TopK
        }[this.game.params.type]
        const res = await RedisCall.call<Trial.Done.IReq, Trial.Done.IRes>(
            Trial.Done.name,
            {
              userId: playerState.user.id,
              onceMore,
              namespace: phaseToNamespace(trialNamespace)
            }
        )
        res ? cb(res.lobbyUrl) : null
        break
      }
    }
  }
}
