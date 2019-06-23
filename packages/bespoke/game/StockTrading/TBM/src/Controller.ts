import {
  BaseController,
  baseEnum,
  gameId2PlayUrl,
  IActor,
  IMoveCallback,
  RedisCall,
  TGameState,
  TPlayerState
} from "bespoke-server";
import {
  MoveType,
  PushType,
  Role,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  SHOUT_TIMER
} from "./config";
import { Phase, STOCKS, phaseToNamespace } from "bespoke-game-stock-trading-config";
import {GameOver} from 'elf-protocol'

export default class Controller extends BaseController<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  private role = Role.Buyer;
  private robotJoined = false;
  private shoutTimer: NodeJS.Timer;

  initGameState(): TGameState<IGameState> {
    const gameState = super.initGameState();
    gameState.status = baseEnum.GameStatus.started;
    gameState.stockIndex = genRandomInt(0, STOCKS.length - 1);
    return gameState;
  }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const playerState = await super.initPlayerState(actor);
    playerState.actualNum = 0;
    playerState.profit = 0;
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
      case MoveType.join: {
        if (playerState.role !== undefined) {
          return;
        }
        this.initPlayer(playerState);
        if ((playerState.actor.type = baseEnum.Actor.serverRobot)) {
          this.push(playerState.actor, PushType.robotShout);
        }
        break;
      }
      case MoveType.shout: {
        if (playerState.price !== undefined) {
          return;
        }
        if (this.invalidParams(playerState, params)) {
          return cb(
            playerState.role === Role.Buyer
              ? "价格应不大于估值"
              : "价格应不小于估值"
          );
        }
        playerState.price = params.price;
        playerState.bidNum = params.num;
        const playerStateArray = Object.values(playerStates);
        if (!this.robotJoined && playerStateArray.length < groupSize) {
          // 第一次有人报价时补满机器人
          this.initRobots(groupSize - playerStateArray.length);
          this.robotJoined = true;
        }
        if (
          playerStateArray.length === groupSize &&
          playerStateArray.every(ps => ps.price !== undefined)
        ) {
          this.processProfits(gameState, playerStateArray);
        }
        break;
      }
      case MoveType.nextStage: {
        const { onceMore } = params;
        const res = await RedisCall.call<GameOver.IReq, GameOver.IRes>(
          GameOver.name,
          {
            playUrl: gameId2PlayUrl(this.game.id, actor.token),
            onceMore,
            namespace: phaseToNamespace(Phase.TBM)
          }
        );
        res ? cb(res.lobbyUrl) : null;
        break;
      }
    }
  }

  private invalidParams(
    playerState: IPlayerState,
    params: IMoveParams
  ): boolean {
    const { price, num } = params;
    const { role, startingPrice, startingQuota, privateValue } = playerState;
    return (
      !price ||
      !num ||
      (role === Role.Buyer &&
        (price * num > startingPrice || price > privateValue)) ||
      (role == Role.Seller && (num > startingQuota || price < privateValue))
    );
  }

  private processProfits(
    gameState: IGameState,
    playerStates: Array<IPlayerState>
  ) {
    const buyerList = playerStates
      .filter(ps => ps.role === Role.Buyer)
      .sort((a, b) => b.price - a.price);
    const sellerList = playerStates
      .filter(ps => ps.role === Role.Seller)
      .sort((a, b) => a.price - b.price);
    const { strikePrice, strikeNum } = this._strikeDeal(buyerList, sellerList);
    this._updateGameState(gameState, strikePrice, strikeNum);
    this._updatePlayerStates(playerStates, strikePrice);
  }

  private _strikeDeal(
    buyerList: Array<IPlayerState>,
    sellerList: Array<IPlayerState>
  ): { strikePrice: number; strikeNum: number } {
    let buyerIndex = 0;
    let sellerIndex = 0;
    let strikeNum = 0;
    let strikePrice = 0;
    while (buyerIndex < buyerList.length && sellerIndex < sellerList.length) {
      const buyer = buyerList[buyerIndex];
      const seller = sellerList[sellerIndex];
      if (buyer.price >= seller.price) {
        const num = Math.min(
          buyer.bidNum - buyer.actualNum,
          seller.bidNum - seller.actualNum
        );
        buyer.actualNum += num;
        seller.actualNum += num;
        strikeNum += num;
        strikePrice = (buyer.price + seller.price) / 2;
        if (buyer.actualNum === buyer.bidNum) {
          buyerIndex++;
        } else {
          sellerIndex++;
        }
      } else {
        break;
      }
    }
    return { strikePrice, strikeNum };
  }

  private _updatePlayerStates(
    playerStates: Array<IPlayerState>,
    strikePrice: number
  ) {
    playerStates.forEach(ps => {
      if (!ps.actualNum) {
        return;
      }
      if (ps.role === Role.Buyer) {
        ps.profit = (ps.privateValue - strikePrice) * ps.actualNum;
      } else {
        ps.profit = (strikePrice - ps.privateValue) * ps.actualNum;
      }
    });
  }

  private _updateGameState(
    gameState: IGameState,
    strikePrice: number,
    strikeNum: number
  ) {
    gameState.strikePrice = strikePrice;
    gameState.strikeNum = strikeNum;
  }

  private initRobots(amount: number) {
    for (let i = 0; i < amount; i++) {
      this.startRobot(`Robot_${i}`);
    }
  }

  private initPlayer(playerState: IPlayerState) {
    const role = this._getRole();
    playerState.role = role;
    playerState.privateValue = this._getPrivatePrice(role);
    if (role === Role.Buyer) {
      playerState.startingPrice = this._getStartingPrice();
    } else {
      playerState.startingQuota = this._getStartingQuota();
    }
    this._shoutTicking();
  }

  private _shoutTicking() {
    if (this.shoutTimer) {
      return;
    }
    const { groupSize } = this.game.params;
    let shoutTime = 1;
    this.shoutTimer = global.setInterval(async () => {
      const playerStates = await this.stateManager.getPlayerStates();
      const playerStateArray = Object.values(playerStates);
      playerStateArray.forEach(s => {
        this.push(s.actor, PushType.shoutTimer, { shoutTime });
      });
      if (
        playerStateArray.length === groupSize &&
        playerStateArray.every(ps => ps.price !== undefined)
      ) {
        clearInterval(this.shoutTimer);
        return;
      }
      if (
        !this.robotJoined &&
        playerStateArray.length < groupSize &&
        SHOUT_TIMER - shoutTime < 30
      ) {
        // 倒计时30秒时补满机器人
        this.initRobots(groupSize - playerStateArray.length);
        this.robotJoined = true;
      }
      if (shoutTime++ < SHOUT_TIMER) {
        return;
      }
      clearInterval(this.shoutTimer);
      await this._shoutTickEnds(playerStateArray);
    }, 1000);
  }

  private async _shoutTickEnds(playerStates: Array<IPlayerState>) {
    const shoutedPlayerStates = playerStates.filter(ps => {
      if (ps.price === undefined) {
        ps.price = 0;
        ps.bidNum = 0;
        return false;
      }
      return true;
    });
    const gameState = await this.stateManager.getGameState();
    this.processProfits(gameState, shoutedPlayerStates);
    await this.stateManager.syncState();
  }

  private _getRole(): Role {
    const curRole = this.role;
    this.role = curRole === Role.Buyer ? Role.Seller : Role.Buyer;
    return curRole;
  }

  private _getPrivatePrice(role: Role): number {
    const {
      buyerPrivateMin,
      buyerPrivateMax,
      sellerPrivateMin,
      sellerPrivateMax
    } = this.game.params;
    let min: number, max: number;
    if (role === Role.Buyer) {
      min = buyerPrivateMin;
      max = buyerPrivateMax;
    } else {
      min = sellerPrivateMin;
      max = sellerPrivateMax;
    }
    return genRandomInt(min * 100, max * 100) / 100;
  }

  private _getStartingPrice(): number {
    const { buyerCapitalMin, buyerCapitalMax } = this.game.params;
    return genRandomInt(buyerCapitalMin / 100, buyerCapitalMax / 100) * 100;
  }

  private _getStartingQuota(): number {
    const { sellerQuotaMin, sellerQuotaMax } = this.game.params;
    return genRandomInt(sellerQuotaMin / 100, sellerQuotaMax / 100) * 100;
  }
}

export function genRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
