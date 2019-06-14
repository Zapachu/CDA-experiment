import {
  BaseController,
  IActor,
  IMoveCallback,
  TGameState,
  TPlayerState,
  baseEnum,
  RedisCall,
  gameId2PlayUrl
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
  MoveType,
  PlayerStatus,
  PushType,
  IPOType,
  minA,
  minB,
  maxA,
  maxB,
  startingMultiplier,
  SHOUT_TIMER,
  namespace
} from "./config";
import {Phase, PhaseDone, STOCKS} from 'bespoke-game-stock-trading-config'

export default class Controller extends BaseController<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  private matchIntervals: { [groupIndex: string]: NodeJS.Timer } = {};
  private shoutIntervals: { [groupIndex: string]: NodeJS.Timer } = {};

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
      // case MoveType.startSingle: {
      //   if (playerState.playerStatus !== PlayerStatus.intro) {
      //     break;
      //   }
      //   this.createGroupAndInitRobots(gameState, playerState);
      //   break;
      // }
      case MoveType.startMulti: {
        if (playerState.playerStatus !== PlayerStatus.intro) {
          break;
        }
        let groupIndex = gameState.groups.findIndex(
          ({ playerNum, isMulti }) => playerNum < groupSize && isMulti
        );
        if (groupIndex === -1) {
          const group: GameState.IGroup = {
            playerNum: 0,
            roundIndex: 0,
            isMulti: true,
            rounds: [{}]
          };
          groupIndex = gameState.groups.push(group) - 1;
          this.startMatchTicking(group, groupIndex);
        }
        this._joinPlayer(playerState, gameState.groups[groupIndex], groupIndex);
        break;
      }
      case MoveType.joinRobot: {
        let groupIndex = gameState.groups.findIndex(
          ({ playerNum }) => playerNum < groupSize
        );
        if (groupIndex === -1) {
          break;
        }
        const group = gameState.groups[groupIndex];
        this._joinPlayer(playerState, group, groupIndex);
        if (group.playerNum === groupSize) {
          const groupPlayerStates = Object.values(playerStates).filter(s =>
            group.isMulti
              ? s.multi && s.multi.groupIndex === groupIndex
              : s.single && s.single.groupIndex === groupIndex
          );
          this._initState(group, groupPlayerStates);
        }
        break;
      }
      case MoveType.shout: {
        const playerStatus = playerState.playerStatus;
        if (playerStatus !== PlayerStatus.prepared) {
          return;
        }
        let group: GameState.IGroup;
        let groupIndex: number;
        // 单人
        if (playerState.single) {
          const { rounds: playerRounds } = playerState.single;
          groupIndex = playerState.single.groupIndex;
          group = gameState.groups[groupIndex];
          const { roundIndex, rounds: gameRounds } = group;
          const { min } = gameRounds[roundIndex];
          const { privateValue, startingPrice } = playerRounds[roundIndex];
          if (this.invalidParams(params, privateValue, min, startingPrice)) {
            return cb(`价格应在${min}与${privateValue}之间`);
          }
          playerState.playerStatus = PlayerStatus.shouted;
          playerRounds[roundIndex].price = params.price;
          playerRounds[roundIndex].bidNum = params.num;
        } else {
          // 多人
          const { privateValue, startingPrice } = playerState.multi;
          groupIndex = playerState.multi.groupIndex;
          group = gameState.groups[groupIndex];
          const { roundIndex, rounds: gameRounds } = group;
          const { min } = gameRounds[roundIndex];
          if (this.invalidParams(params, privateValue, min, startingPrice)) {
            return cb(`价格应在${min}与${privateValue}之间`);
          }
          playerState.playerStatus = PlayerStatus.shouted;
          playerState.multi.price = params.price;
          playerState.multi.bidNum = params.num;
        }
        const groupPlayerStates = Object.values(playerStates).filter(s =>
          group.isMulti
            ? s.multi && s.multi.groupIndex === groupIndex
            : s.single && s.single.groupIndex === groupIndex
        );
        if (
          !groupPlayerStates.every(s => s.playerStatus === PlayerStatus.shouted)
        ) {
          return;
        }
        const investorStates = groupPlayerStates.map(s =>
          group.isMulti ? s.multi : s.single.rounds[group.roundIndex]
        );
        const marketState = group.rounds[group.roundIndex];

        setTimeout(async () => {
          this.processProfits(
            investorStates as Array<InvestorState>,
            marketState as MarketState
          );
          groupPlayerStates.forEach(
            s => (s.playerStatus = PlayerStatus.result)
          );
          await this.stateManager.syncState();
        }, 2000);
        break;
      }
      // case MoveType.replay: {
      //   if (playerState.playerStatus !== PlayerStatus.result) {
      //     return;
      //   }
      //   if (playerState.single) {
      //     const { groupIndex } = playerState.single;
      //     const group = gameState.groups[groupIndex];
      //     const groupPlayerStates = Object.values(playerStates).filter(
      //       s => s.single && s.single.groupIndex === groupIndex
      //     );
      //     group.roundIndex++;
      //     this._initState(group, groupPlayerStates);
      //   } else {
      //     this.createGroupAndInitRobots(gameState, playerState);
      //   }
      //   break;
      // }
      case MoveType.nextGame: {
        const playerStatus = playerState.playerStatus;
        if (playerStatus !== PlayerStatus.result) {
          return;
        }
        const {onceMore} = params
        const res = await RedisCall.call<PhaseDone.IReq, PhaseDone.IRes>(PhaseDone.name, {
          playUrl: gameId2PlayUrl(this.game.id, actor.token),
          onceMore,
          phase: this.game.params.type == IPOType.Median ? Phase.IPO_Median : Phase.IPO_TopK
        })
        res ? cb(res.lobbyUrl) : null
        break;
      }
    }
  }

  createGroupAndInitRobots(
    gameState: TGameState<IGameState>,
    playerState: TPlayerState<IPlayerState>
  ) {
    const { groupSize } = this.game.params;
    const group: GameState.IGroup = {
      playerNum: 0,
      roundIndex: 0,
      isMulti: false,
      rounds: [{}]
    };
    const groupIndex = gameState.groups.push(group) - 1;
    this._joinPlayer(playerState, group, groupIndex);
    this._initRobots(groupIndex, groupSize - 1);
  }

  _joinPlayer(
    playerState: TPlayerState<IPlayerState>,
    group: GameState.IGroup,
    groupIndex: number
  ) {
    const { groupSize } = this.game.params;
    if (group.playerNum === groupSize) {
      return;
    }
    group.playerNum++;
    if (group.isMulti) {
      playerState.multi = {
        groupIndex
      };
    } else {
      playerState.single = {
        groupIndex,
        rounds: [{}]
      };
    }
    // playerState.playerStatus = PlayerStatus.matching;
  }

  // simulateNPCs(amount: number, min: number, max: number): Array<InvestorState> {
  //   return Array(amount)
  //     .fill("")
  //     .map(_ => {
  //       const price = formatDigits(genRandomInt(min * 100, max * 100) / 100);
  //       const num = genRandomInt(minNPCNum / 100, maxNPCNum / 100) * 100;
  //       return { price, bidNum: num };
  //     });
  // }

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

  _initRobots(groupIndex: number, amount: number) {
    for (let i = 0; i < amount; i++) {
      this.startRobot(`Robot_G${groupIndex}_${i}`);
    }
  }

  _initState(
    group: GameState.IGroup,
    groupPlayerStates: Array<TPlayerState<IPlayerState>>
  ) {
    const max = this._genPrivateMax();
    const min = this._genPrivateMin(max);
    const stockIndex = genRandomInt(0, STOCKS.length - 1);
    const { roundIndex, isMulti, rounds } = group;
    let gameRound = rounds[roundIndex];
    if (!gameRound) {
      gameRound = rounds[roundIndex] = {};
    }
    gameRound.min = min;
    gameRound.max = max;
    gameRound.stockIndex = stockIndex;
    if (isMulti) {
      this.startShoutTicking(group, groupPlayerStates[0].multi.groupIndex);
    }
    groupPlayerStates.forEach((s, i) => {
      const privateValue = this._genPrivateValue(min, max);
      const startingPrice = this._genStartingPrice(min);
      if (isMulti) {
        s.multi.privateValue = privateValue;
        s.multi.startingPrice = startingPrice;
      } else {
        let playerRound = s.single.rounds[roundIndex];
        if (!playerRound) {
          playerRound = s.single.rounds[roundIndex] = {};
        }
        playerRound.privateValue = privateValue;
        playerRound.startingPrice = startingPrice;
      }
      s.playerStatus = PlayerStatus.prepared;
      setTimeout(() => {
        this.push(s.actor, PushType.robotShout, {
          min: gameRound.min,
          max: privateValue,
          startingPrice
        });
      }, 600 * (i + 1));
    });
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

  startShoutTicking(group: GameState.IGroup, groupIndex: number) {
    global.setTimeout(() => {
      const shoutIntervals = this.shoutIntervals;
      let shoutTimer = 1;
      shoutIntervals[groupIndex] = global.setInterval(async () => {
        const playerStates = await this.stateManager.getPlayerStates();
        const groupPlayerStates = Object.values(playerStates).filter(
          s => s.multi && s.multi.groupIndex === groupIndex
        );
        groupPlayerStates.forEach(s => {
          this.push(s.actor, PushType.shoutTimer, {
            shoutTimer
          });
        });
        if (
          groupPlayerStates.every(s => s.playerStatus !== PlayerStatus.prepared)
        ) {
          global.clearInterval(shoutIntervals[groupIndex]);
          delete shoutIntervals[groupIndex];
          return;
        }
        if (shoutTimer++ < SHOUT_TIMER) {
          return;
        }
        global.clearInterval(shoutIntervals[groupIndex]);
        delete shoutIntervals[groupIndex];
        this._autoProcessProfits(group, groupPlayerStates);
        await this.stateManager.syncState();
      }, 1000);
    }, 0);
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
        // groupPlayerStates.forEach(s => {
        //   this.push(s.actor, PushType.matchTimer, {
        //     matchTimer,
        //     matchNum: groupPlayerStates.length
        //   });
        // });
        if (group.playerNum === groupSize) {
          global.clearInterval(matchIntervals[groupIndex]);
          delete matchIntervals[groupIndex];
          this._initState(group, groupPlayerStates);
          await this.stateManager.syncState();
          return;
        }
        if (matchTimer++ < MATCH_TIMER) {
          return;
        }
        global.clearInterval(matchIntervals[groupIndex]);
        delete matchIntervals[groupIndex];
        this._initRobots(groupIndex, groupSize - group.playerNum);
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
        // .filter(s => s.privateValue !== undefined)
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
        // .filter(s => s.privateValue !== undefined)
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
        // .filter(s => s.privateValue !== undefined)
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
      // .filter(s => s.privateValue !== undefined)
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

  _autoProcessProfits(
    group: GameState.IGroup,
    groupPlayerStates: Array<TPlayerState<IPlayerState>>
  ) {
    const investorStates = groupPlayerStates
      .filter(s => {
        if (s.playerStatus === PlayerStatus.prepared) {
          s.multi.price = 0;
          s.multi.bidNum = 0;
          s.multi.actualNum = 0;
          s.multi.profit = 0;
          return false;
        }
        return true;
      })
      .map(s => s.multi);
    const marketState = group.rounds[group.roundIndex];

    this.processProfits(
      investorStates as Array<InvestorState>,
      marketState as MarketState
    );
    groupPlayerStates.forEach(s => (s.playerStatus = PlayerStatus.result));
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

export function genRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatDigits(num: number): number {
  return +num.toFixed(2);
}

interface InvestorState {
  privateValue: number;
  price: number;
  bidNum: number;
  actualNum?: number;
  profit?: number;
}

interface MarketState {
  strikePrice?: number;
  min: number;
}
