import {BaseController, IActor, IMoveCallback, RedisCall, TGameState, TPlayerState} from '@bespoke/server'
import {
  BuyNumberRange,
  CONFIG,
  ICreateParams,
  IGameRoundState,
  IGameState,
  IMoveParams,
  IPlayerRoundState,
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
  roundTimers: Array<NodeJS.Timer> = []

  initGameState(): TGameState<IGameState> {
    const gameState = super.initGameState()
    gameState.playerNum = 0
    gameState.round = 0
    gameState.rounds = Array(CONFIG.round).fill(null).map(() => {
      const maxPrice = formatDigits(genRandomInt(PriceRange.limit.min * 100, PriceRange.limit.max * 100) / 100),
          minPrice = formatDigits(genRandomInt(maxPrice * PriceRange.minRatio.min, maxPrice * PriceRange.minRatio.max))
      return {
        minPrice,
        maxPrice,
        stockIndex: genRandomInt(0, STOCKS.length - 1)
      } as IGameRoundState
    })
    return gameState
  }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const gameState = await this.stateManager.getGameState()
    const playerState = await super.initPlayerState(actor)
    playerState.rounds = Array(CONFIG.round).fill(null).map((_, i) => ({
      status: i === 0 ? PlayerStatus.guide : PlayerStatus.prepared,
      privateValue: formatDigits(genRandomInt(gameState.rounds[i].minPrice * 100, gameState.rounds[i].maxPrice * 100) / 100),
      startMoney: Math.ceil(gameState.rounds[i].minPrice * BuyNumberRange.baseCount / 10000) * 10000,
      price: 0,
      bidNum: 0,
      actualNum: 0,
      profit: 0
    } as IPlayerRoundState))
    return playerState
  }

  async playerMoveReducer(
      actor: IActor,
      type: string,
      params: IMoveParams,
      cb: IMoveCallback
  ): Promise<void> {
    const gameState = await this.stateManager.getGameState(),
        {round} = gameState,
        gameRoundState = gameState.rounds[round],
        playerState = await this.stateManager.getPlayerState(actor),
        playerRoundState = playerState.rounds[round],
        playerStates = await this.stateManager.getPlayerStates()
    switch (type) {
      case MoveType.guideDone: {
        playerRoundState.status = PlayerStatus.test
        break
      }
      case MoveType.getIndex: {
        if (playerState.index !== undefined || gameState.playerNum === CONFIG.groupSize) {
          break
        }
        playerState.index = gameState.playerNum++
        playerRoundState.status = PlayerStatus.prepared
        if (playerState.index === 0) {
          global.setTimeout(async () => {
            if (gameState.playerNum < CONFIG.groupSize) {
              Array(CONFIG.groupSize - gameState.playerNum).fill(null).forEach(async (_, i) => {
                await this.startRobot(i)
              })
            }
            await this.startRound()
          }, 3e3)
        }
        break
      }
      case MoveType.shout: {
        if (playerRoundState.status !== PlayerStatus.prepared) {
          return
        }
        const {privateValue, startMoney} = playerRoundState,
            {minPrice} = gameRoundState
        const errMsg = Controller.checkShoutParams(
            params,
            privateValue,
            minPrice,
            startMoney
        )
        if (errMsg) {
          return cb(errMsg)
        }
        playerRoundState.status = PlayerStatus.shouted
        playerRoundState.price = params.price
        playerRoundState.bidNum = params.num
        const playerRoundStatesArr = Object.values(playerStates).map(({rounds}) => rounds[round])
        if (
            !playerRoundStatesArr.every(s => s.status === PlayerStatus.shouted)
        ) {
          return
        }
        setTimeout(async () => {
          this.calcProfit(gameState, gameRoundState, playerRoundStatesArr)
          await this.stateManager.syncState()
        }, 2000)
        break
      }
      case MoveType.nextGame: {
        const status = playerRoundState.status
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

  async startRound() {
    const gameState = await this.stateManager.getGameState(),
        {rounds, round} = gameState,
        gameRoundState = rounds[round]
    global.setTimeout(() => {
      let shoutTimer = 1
      this.roundTimers[round] = global.setInterval(async () => {
        const playerStates = await this.stateManager.getPlayerStates(),
            playerStatesArray = Object.values(playerStates),
            playerRoundStatesArray = playerStatesArray.map(({rounds}) => rounds[round])
        this.push(playerStatesArray.map(({actor}) => actor), PushType.shoutTimer, {shoutTimer})
        if (
            playerRoundStatesArray.every(s => s.status !== PlayerStatus.prepared)
        ) {
          global.clearInterval(this.roundTimers[round])
          return
        }
        if (shoutTimer++ < CONFIG.tradeTime) {
          return
        }
        global.clearInterval(this.roundTimers[round])
        this.calcProfit(gameState, gameRoundState, playerRoundStatesArray)
        await this.stateManager.syncState()
      }, 1e3)
    }, 0)
    global.setTimeout(() => this.broadcast(PushType.startRound), 1e3)
  }

  //region calcProfit
  calcProfit(
      gameState:IGameState,
      gameRoundState: IGameRoundState,
      playerRoundStatesArr: Array<IPlayerRoundState>
  ) {
    const sortedPlayerStates = playerRoundStatesArr.filter(s => s.status === PlayerStatus.shouted).sort((a, b) => b.price - a.price)
    const {type} = this.game.params
    switch (type) {
      case IPOType.FPSBA:
        this.calcProfit_FPSBA(gameRoundState, sortedPlayerStates)
        break
      case IPOType.Median:
        this.calcProfit_Median(gameRoundState, sortedPlayerStates)
        break
      case IPOType.TopK:
        this.calcProfit_TopK(gameRoundState, sortedPlayerStates)
        break
    }
    playerRoundStatesArr.forEach(s => (s.status = PlayerStatus.result))
    if (gameState.round < CONFIG.round - 1) {
      global.setTimeout(async () => {
        gameState.round++
        this.startRound()
        await this.stateManager.syncState()
      }, CONFIG.secondsToShowResult * 1e3)
    }
  }

  calcProfit_Median(
      IGameState: IGameRoundState,
      sortedPlayerStates: Array<IPlayerRoundState>
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
          .forEach(s => {
            s.actualNum = s.bidNum
            s.profit = formatDigits(
                (s.privateValue - IGameState.tradePrice) * s.actualNum
            )
          })
      return
    }
    const buyers: Array<IPlayerRoundState> = []
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
          .forEach(s => {
            s.profit = formatDigits(
                (s.privateValue - IGameState.tradePrice) * s.actualNum
            )
          })
    }
  }

  calcProfit_TopK(
      IGameState: IGameRoundState,
      sortedPlayerStates: Array<IPlayerRoundState>
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
      IGameState: IGameRoundState,
      sortedPlayerStates: Array<IPlayerRoundState>
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

  //endregion
}
