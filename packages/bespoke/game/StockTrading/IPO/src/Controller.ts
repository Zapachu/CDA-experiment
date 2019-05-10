import {
  BaseController,
  IActor,
  IMoveCallback,
  TGameState,
  TPlayerState
} from "bespoke-server";
import {
  GameState,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams
} from "./interface";
import {
  MATCH_TIMER,
  FetchType,
  MoveType,
  PlayerStatus,
  PushType,
  IPOType,
  minA,
  minB,
  maxA,
  maxB,
  startingMultiplier,
  minNPCNum,
  maxNPCNum,
  STOCKS
} from "./config";

export default class Controller extends BaseController<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  FetchType
> {
  private matchIntervals: { [groupIndex: string]: NodeJS.Timer } = {};

  initGameState(): TGameState<IGameState> {
    const gameState = super.initGameState();
    gameState.groups = [];
    return gameState;
  }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const playerState = await super.initPlayerState(actor);
    playerState.playerStatus = PlayerStatus.intro;
    return playerState;
  }

  protected async playerMoveReducer(
    actor: IActor,
    type: string,
    params: IMoveParams,
    cb: IMoveCallback
  ): Promise<void> {
    const { groupSize } = this.game.params;
    const playerState = await this.stateManager.getPlayerState(actor),
      gameState = await this.stateManager.getGameState(),
      playerStates = await this.stateManager.getPlayerStates();
    switch (type) {
      case MoveType.startMultiPlayer: {
        if (playerState.playerStatus === PlayerStatus.matching) {
          break;
        }
        let groupIndex = gameState.groups.findIndex(
          ({ players }) => players && players.length < groupSize
        );
        if (groupIndex === -1) {
          const group: GameState.IGroup = {
            players: []
          };
          groupIndex = gameState.groups.push(group) - 1;
          this.startMatchTicking(group, groupIndex);
        }
        const group = gameState.groups[groupIndex];
        const positionIndex = group.players.push(playerState.actor.token) - 1;
        playerState.multi = {
          groupIndex,
          positionIndex
        };
        playerState.playerStatus = PlayerStatus.matching;
        break;
      }
      case MoveType.startSinglePlayer: {
        this.initSingle(playerState);
        break;
      }
      case MoveType.shout: {
        // 单人
        if (playerState.single) {
          const playerStatus = playerState.playerStatus;
          const { roundIndex, rounds } = playerState.single;
          const curRound = rounds[roundIndex];
          const { privateValue, min, max, startingPrice } = curRound;
          if (playerStatus === PlayerStatus.shouted) {
            return;
          }
          if (this.invalidParams(params, privateValue, min, startingPrice)) {
            return cb("invalid input");
          }
          playerState.playerStatus = PlayerStatus.shouted;
          curRound.price = params.price;
          curRound.bidNum = params.num;
          const NPCs = this.simulateNPCs(groupSize - 1, min, max);
          setTimeout(async () => {
            this.processProfits(
              [curRound as InvestorState, ...NPCs],
              curRound as MarketState
            );
            playerState.playerStatus = PlayerStatus.result;
            await this.stateManager.syncState();
          }, 2000);
        } else {
          // 多人
          const playerStatus = playerState.playerStatus;
          const { privateValue, startingPrice, groupIndex } = playerState.multi;
          const group = gameState.groups[groupIndex];
          const { min, max } = group;
          if (playerStatus === PlayerStatus.shouted) {
            return;
          }
          if (this.invalidParams(params, privateValue, min, startingPrice)) {
            return;
          }
          playerState.playerStatus = PlayerStatus.shouted;
          playerState.multi.price = params.price;
          playerState.multi.bidNum = params.num;
          const groupPlayerStates = Object.values(playerStates).filter(
            s => s.multi && s.multi.groupIndex === groupIndex
          );
          if (
            !groupPlayerStates.every(
              s => s.playerStatus === PlayerStatus.shouted
            )
          ) {
            return;
          }
          const NPCs = this.simulateNPCs(
            groupSize - groupPlayerStates.length,
            min,
            max
          );
          setTimeout(async () => {
            this.processProfits(
              [
                ...(groupPlayerStates.map(s => s.multi) as Array<
                  InvestorState
                >),
                ...NPCs
              ],
              group as MarketState
            );
            playerState.playerStatus = PlayerStatus.result;
            await this.stateManager.syncState();
          }, 2000);
        }
        break;
      }
      case MoveType.replay: {
        if (playerState.playerStatus !== PlayerStatus.result) {
          return;
        }
        if (playerState.single) {
          playerState.single.roundIndex++;
          playerState.single.rounds[
            playerState.single.roundIndex
          ] = this.genInitParams();
          playerState.playerStatus = PlayerStatus.prepared;
        } else {
          this.initSingle(playerState);
        }
        cb(
          null,
          playerState.single.rounds[playerState.single.roundIndex].stockIndex
        );
        break;
      }
      case MoveType.nextGame: {
        break;
      }
    }
  }

  simulateNPCs(amount: number, min: number, max: number): Array<InvestorState> {
    return Array(amount)
      .fill("")
      .map(_ => {
        const price = formatDigits(genRandomInt(min * 100, max * 100) / 100);
        const num = genRandomInt(minNPCNum / 100, maxNPCNum / 100) * 100;
        return { price, bidNum: num };
      });
  }

  invalidParams(
    params: IMoveParams,
    privateValue: number,
    min: number,
    startingPrice: number
  ): boolean {
    return (
      params.num <= 0 ||
      params.price < min ||
      params.price > privateValue ||
      params.price * params.num > startingPrice
    );
  }

  initSingle(playerState: TPlayerState<IPlayerState>) {
    playerState.playerStatus = PlayerStatus.prepared;
    playerState.single = {
      roundIndex: 0,
      rounds: [this.genInitParams()]
    };
    // this._initRobots(groupSize - 1)
  }

  initMulti(
    group: GameState.IGroup,
    groupPlayerStates: Array<TPlayerState<IPlayerState>>
  ) {
    const max = this._genPrivateMax();
    const min = this._genPrivateMin(max);
    const stockIndex = genRandomInt(0, STOCKS.length - 1);
    group.min = min;
    group.max = max;
    group.stockIndex = stockIndex;
    groupPlayerStates.forEach(s => {
      const privateValue = this._genPrivateValue(min, max);
      const startingPrice = this._genStartingPrice(min);
      s.playerStatus = PlayerStatus.prepared;
      s.multi.privateValue = privateValue;
      s.multi.startingPrice = startingPrice;
    });
  }

  genInitParams(): {
    max: number;
    min: number;
    privateValue: number;
    startingPrice: number;
    stockIndex: number;
  } {
    const max = this._genPrivateMax();
    const min = this._genPrivateMin(max);
    const privateValue = this._genPrivateValue(min, max);
    const startingPrice = this._genStartingPrice(min);
    const stockIndex = genRandomInt(0, STOCKS.length - 1);
    return { max, min, privateValue, startingPrice, stockIndex };
  }

  _genPrivateValue(min: number, max: number): number {
    return formatDigits(genRandomInt(min * 100, max * 100) / 100);
  }

  _genPrivateMax(): number {
    return formatDigits(genRandomInt(minA * 100, maxA * 100) / 100);
  }

  _genPrivateMin(max: number): number {
    return formatDigits((max * genRandomInt(minB * 100, maxB * 100)) / 100);
  }

  _genStartingPrice(min: number): number {
    const original = min * startingMultiplier;
    const int = Math.floor(original / 10000);
    const remainder = original % 10000;
    if (remainder > 0) {
      return formatDigits((int + 1) * 10000);
    }
    return formatDigits(original);
  }

  startMatchTicking(group: GameState.IGroup, groupIndex: number) {
    const { groupSize } = this.game.params;
    global.setTimeout(() => {
      const matchIntervals = this.matchIntervals;
      let matchTimer = 1;
      matchIntervals[groupIndex] = global.setInterval(async () => {
        const playerStates = await this.stateManager.getPlayerStates();
        const groupPlayerStates = Object.values(playerStates).filter(
          s => s.multi && s.multi.groupIndex === groupIndex
        );
        groupPlayerStates.forEach(s => {
          this.push(s.actor, PushType.matchTimer, {
            matchTimer,
            matchNum: groupPlayerStates.length
          });
        });
        if (group.players.length === groupSize) {
          groupPlayerStates.forEach(s => {
            this.push(s.actor, PushType.matchMsg, { matchMsg: "匹配成功" });
          });
          global.clearInterval(matchIntervals[groupIndex]);
          delete matchIntervals[groupIndex];
          this.initMulti(group, groupPlayerStates);
          await this.stateManager.syncState();
          return;
        }
        if (matchTimer++ < MATCH_TIMER) {
          return;
        }
        global.clearInterval(matchIntervals[groupIndex]);
        delete matchIntervals[groupIndex];
        if (group.players.length > 1) {
          this.initMulti(group, groupPlayerStates);
        } else {
          this.initSingle(groupPlayerStates[0]);
        }
        await this.stateManager.syncState();
      }, 1000);
    }, 0);
  }

  _processMedianProfits(
    marketState: MarketState,
    sortedPlayerStates: Array<InvestorState>
  ) {
    const { total } = this.game.params;
    const numberOfShares = sortedPlayerStates.reduce(
      (acc, item) => acc + item.bidNum,
      0
    );
    // 市场总数小于发行股数
    if (numberOfShares <= total) {
      marketState.strikePrice = marketState.min;
      sortedPlayerStates
        .filter(s => s.privateValue !== undefined)
        .forEach(s => {
          s.actualNum = s.bidNum;
          s.profit = formatDigits(
            (s.privateValue - marketState.strikePrice) * s.actualNum
          );
        });
      return;
    }
    const buyers: Array<InvestorState> = [];
    const buyerLimits: Array<number> = [];
    const median = Math.floor(numberOfShares / 2);
    let leftNum = median;
    let buyerTotal = 0;
    for (let i = 0; i < sortedPlayerStates.length; i++) {
      const curPlayer = sortedPlayerStates[i];
      buyerTotal += curPlayer.bidNum;
      buyers.push(curPlayer);
      buyerLimits.push(curPlayer.bidNum + median - leftNum);
      if (curPlayer.bidNum >= leftNum) {
        marketState.strikePrice = curPlayer.price;
        break;
      }
      leftNum -= curPlayer.bidNum;
    }
    // 买家总数小于发行股数
    if (buyerTotal <= total) {
      buyers
        .filter(s => s.privateValue !== undefined)
        .forEach(s => {
          s.actualNum = s.bidNum;
          s.profit = formatDigits(
            (s.privateValue - marketState.strikePrice) * s.actualNum
          );
        });
    } else {
      // 抽签分配
      buyers.forEach(s => (s.actualNum = 0));
      let count = 0;
      while (count++ < total) {
        const random = genRandomInt(1, buyerTotal);
        const buyerIndex = this.findBuyerIndex(random, buyerLimits);
        buyers[buyerIndex].actualNum++;
      }
      buyers
        .filter(s => s.privateValue !== undefined)
        .forEach(s => {
          s.profit = formatDigits(
            (s.privateValue - marketState.strikePrice) * s.actualNum
          );
        });
    }
  }

  _processTopKProfits(
    marketState: MarketState,
    sortedPlayerStates: Array<InvestorState>
  ) {
    const { total } = this.game.params;
    const buyers = [];
    let strikePrice;
    let leftNum = total;
    for (let i = 0; i < sortedPlayerStates.length; i++) {
      const curPlayer = sortedPlayerStates[i];
      curPlayer.actualNum =
        curPlayer.bidNum > leftNum ? leftNum : curPlayer.bidNum;
      buyers.push(curPlayer);
      if (curPlayer.bidNum >= leftNum) {
        strikePrice = curPlayer.price;
        break;
      }
      leftNum -= curPlayer.bidNum;
    }
    marketState.strikePrice =
      strikePrice === undefined ? marketState.min : strikePrice;
    buyers
      .filter(s => s.privateValue !== undefined)
      .forEach(s => {
        s.profit = formatDigits(
          (s.privateValue - marketState.strikePrice) * s.actualNum
        );
      });
  }

  processProfits(playerStates: Array<InvestorState>, marketState: MarketState) {
    const { type } = this.game.params;
    const sortedPlayerStates = playerStates.sort((a, b) => b.price - a.price);
    // 中位数
    if (type === IPOType.Median) {
      this._processMedianProfits(marketState, sortedPlayerStates);
    }
    // 前K位
    if (type === IPOType.TopK) {
      this._processTopKProfits(marketState, sortedPlayerStates);
    }
  }

  findBuyerIndex(num: number, array: Array<number>): number {
    let lo = 0;
    let hi = array.length - 1;
    while (lo < hi) {
      const mid = Math.floor((hi - lo) / 2 + lo);
      if (array[mid] === num) {
        return mid;
      } else if (num > array[mid]) {
        lo = mid + 1;
      } else {
        if (mid === 0 || num > array[mid - 1]) {
          return mid;
        }
        hi = mid - 1;
      }
    }
    return lo;
  }
}

function genRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDigits(num: number): number {
  return +num.toFixed(2);
}

interface InvestorState {
  privateValue?: number;
  price: number;
  bidNum: number;
  actualNum?: number;
  profit?: number;
}

interface MarketState {
  strikePrice?: number;
  min: number;
}
