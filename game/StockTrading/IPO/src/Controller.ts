import {BaseController, IActor, IMoveCallback, RedisCall, TGameState, TPlayerState} from '@bespoke/server'
import {
  BuyNumberRange,
  CONFIG,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPOType,
  IPushParams,
  MoveType,
  PlayerStatus,
  PriceRange,
  PushType
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

  initGameState(): TGameState<IGameState> {
    const gameState = super.initGameState()
    const max = formatDigits(genRandomInt(PriceRange.limit.min * 100, PriceRange.limit.max * 100) / 100),
        min = formatDigits(genRandomInt(max * PriceRange.minRatio.min, max * PriceRange.minRatio.max))
    gameState.playerNum = 0
    gameState.minPrice = min
    gameState.maxPrice = max
    gameState.stockIndex = genRandomInt(0, STOCKS.length - 1)
    return gameState
  }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const gameState = await this.stateManager.getGameState()
    const playerState = await super.initPlayerState(actor)
    playerState.status = PlayerStatus.guide
    playerState.privateValue = formatDigits(genRandomInt(gameState.minPrice * 100, gameState.maxPrice * 100) / 100)
    playerState.startMoney = Math.ceil(gameState.minPrice * BuyNumberRange.baseCount / 10000) * 10000
    playerState.price = 0
    playerState.bidNum = 0
    playerState.actualNum = 0
    playerState.profit = 0
    return playerState
  }

  async playerMoveReducer(
      actor: IActor,
      type: string,
      params: IMoveParams,
      cb: IMoveCallback
  ): Promise<void> {
    const playerState = await this.stateManager.getPlayerState(actor),
        gameState = await this.stateManager.getGameState(),
        playerStates = await this.stateManager.getPlayerStates()
    switch (type) {
      case MoveType.guideDone: {
        playerState.status = PlayerStatus.test
        break
      }
      case MoveType.getIndex: {
        if (playerState.index !== undefined || gameState.playerNum === CONFIG.groupSize) {
          break
        }
        playerState.index = gameState.playerNum++
        playerState.status = PlayerStatus.prepared
        if (playerState.index === 0) {
          global.setTimeout(async () => {
            if (gameState.playerNum < CONFIG.groupSize) {
              Array(CONFIG.groupSize - gameState.playerNum).fill(null).forEach(async (_, i) => {
                await this.startRobot(i)
              })
            }
            await this.startTrade()
          }, 3e3)
        }
        break
      }
      case MoveType.shout: {
        if (playerState.status !== PlayerStatus.prepared) {
          return
        }
        const {privateValue, startMoney} = playerState,
            {minPrice} = gameState
        const errMsg = Controller.checkShoutParams(
            params,
            privateValue,
            minPrice,
            startMoney
        )
        if (errMsg) {
          return cb(errMsg)
        }
        playerState.status = PlayerStatus.shouted
        playerState.price = params.price
        playerState.bidNum = params.num
        const playerStatesArr = Object.values(playerStates)
        if (
            !playerStatesArr.every(s => s.status === PlayerStatus.shouted)
        ) {
          return
        }
        setTimeout(async () => {
          this.calcProfit(gameState, playerStatesArr)
          playerStatesArr.forEach(
              s => (s.status = PlayerStatus.result)
          )
          await this.stateManager.syncState()
        }, 2000)
        break
      }
      case MoveType.nextGame: {
        const status = playerState.status
        if (status !== PlayerStatus.result) {
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

  static checkShoutParams(
      params: IMoveParams,
      privateValue: number,
      minPrice: number,
      startMoney: number
  ): string {
    if (params.num <= 0 || params.price * params.num > startMoney) {
      return '您购买的股票数量超过您的可购买数量'
    }
    if (params.price < minPrice || params.price > privateValue) {
      return `价格应在${minPrice}与${privateValue}之间`
    }
    return null
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
            playerStatesArray.every(s => s.status !== PlayerStatus.prepared)
        ) {
          global.clearInterval(shoutIntervals)
          return
        }
        if (shoutTimer++ < CONFIG.tradeTime) {
          return
        }
        global.clearInterval(shoutIntervals)
        this.calcProfit(gameState, playerStatesArray)
        await this.stateManager.syncState()
      }, 1000)
    }, 0)
  }

  //region calcProfit
  calcProfit(
      gameState: IGameState,
      playerStates: Array<IPlayerState>
  ) {
    const sortedPlayerStates = playerStates.filter(s => s.status === PlayerStatus.shouted).sort((a, b) => b.price - a.price)
    const {type} = this.game.params
    switch (type) {
      case IPOType.FPSBA:
        this.calcProfit_FPSBA(gameState, sortedPlayerStates)
        break
      case IPOType.Median:
        this.calcProfit_Median(gameState, sortedPlayerStates)
        break
      case IPOType.TopK:
        this.calcProfit_TopK(gameState, sortedPlayerStates)
        break
    }
    playerStates.forEach(s => (s.status = PlayerStatus.result))
  }

  calcProfit_Median(
      IGameState: IGameState,
      sortedPlayerStates: Array<IPlayerState>
  ) {
    function findBuyerIndex(num: number, array: Array<number>): number {
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

    const numberOfShares = sortedPlayerStates.reduce(
        (acc, item) => acc + item.bidNum,
        0
    )
    // 市场总数小于发行股数
    if (numberOfShares <= CONFIG.marketStockAmount) {
      IGameState.tradePrice = IGameState.minPrice
      sortedPlayerStates
      // .filter(s => s.privateValue !== undefined)
          .forEach(s => {
            s.actualNum = s.bidNum
            s.profit = formatDigits(
                (s.privateValue - IGameState.tradePrice) * s.actualNum
            )
          })
      return
    }
    const buyers: Array<IPlayerState> = []
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
        IGameState.tradePrice = curPlayer.price
        break
      }
      leftNum -= curPlayer.bidNum
    }
    // 买家总数小于发行股数
    if (buyerTotal <= CONFIG.marketStockAmount) {
      buyers
      // .filter(s => s.privateValue !== undefined)
          .forEach(s => {
            s.actualNum = s.bidNum
            s.profit = formatDigits(
                (s.privateValue - IGameState.tradePrice) * s.actualNum
            )
          })
    } else {
      // 抽签分配
      buyers.forEach(s => (s.actualNum = 0))
      let count = 0
      while (count++ < CONFIG.marketStockAmount) {
        const random = genRandomInt(1, buyerTotal)
        const buyerIndex = findBuyerIndex(random, buyerLimits)
        buyers[buyerIndex].actualNum++
      }
      buyers
      // .filter(s => s.privateValue !== undefined)
          .forEach(s => {
            s.profit = formatDigits(
                (s.privateValue - IGameState.tradePrice) * s.actualNum
            )
          })
    }
  }

  calcProfit_TopK(
      IGameState: IGameState,
      sortedPlayerStates: Array<IPlayerState>
  ) {
    const buyers = []
    let tradePrice
    let leftNum = CONFIG.marketStockAmount
    for (let i = 0; i < sortedPlayerStates.length; i++) {
      const curPlayer = sortedPlayerStates[i]
      curPlayer.actualNum =
          curPlayer.bidNum > leftNum ? leftNum : curPlayer.bidNum
      buyers.push(curPlayer)
      if (curPlayer.bidNum >= leftNum) {
        tradePrice = curPlayer.price
        break
      }
      leftNum -= curPlayer.bidNum
    }
    IGameState.tradePrice =
        tradePrice === undefined ? IGameState.minPrice : tradePrice
    buyers
        .forEach(s => {
          s.profit = formatDigits(
              (s.privateValue - IGameState.tradePrice) * s.actualNum
          )
        })
  }

  calcProfit_FPSBA(
      IGameState: IGameState,
      sortedPlayerStates: Array<IPlayerState>
  ) {
    const buyers = []
    let tradePrice
    let leftNum = CONFIG.marketStockAmount
    for (let i = 0; i < sortedPlayerStates.length; i++) {
      const curPlayer = sortedPlayerStates[i]
      curPlayer.actualNum =
          curPlayer.bidNum > leftNum ? leftNum : curPlayer.bidNum
      buyers.push(curPlayer)
      if (curPlayer.bidNum >= leftNum) {
        tradePrice = curPlayer.price
        break
      }
      leftNum -= curPlayer.bidNum
    }
    IGameState.tradePrice =
        tradePrice === undefined ? IGameState.minPrice : tradePrice
    buyers
    // .filter(s => s.privateValue !== undefined)
        .forEach(s => {
          s.profit = formatDigits(
              (s.privateValue - IGameState.tradePrice) * s.actualNum
          )
        })
  }

  //endregion
}
