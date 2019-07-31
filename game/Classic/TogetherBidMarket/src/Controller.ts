import {
  BaseController,
  IActor,
  IMoveCallback,
  TGameState,
  TPlayerState
} from "@bespoke/server";
import {
  ICreateParams,
  IGameState,
  IPlayerState,
  IPushParams,
  IMoveParams,
  IGroupState,
  IGameRoundState,
  IPlayerRoundState,
  MoveType,
  PushType,
  NEW_ROUND_TIMER,
  PlayerStatus
} from "./config";

export default class Controller extends BaseController<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  initGameState(): TGameState<IGameState> {
    const gameState = super.initGameState();
    gameState.groups = [];
    return gameState;
  }

  // async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
  //   const {
  //     game: {
  //       params: { roundParams }
  //     }
  //   } = this;
  //   const playerState = await super.initPlayerState(actor);
  //   return playerState;
  // }

  protected async playerMoveReducer(
    actor: IActor,
    type: string,
    params: IMoveParams,
    cb: IMoveCallback
  ): Promise<void> {
    const {
      game: {
        params: { groupSize, positions, rounds }
      }
    } = this;
    const playerState = await this.stateManager.getPlayerState(actor),
      gameState = await this.stateManager.getGameState(),
      playerStates = await this.stateManager.getPlayerStates();
    switch (type) {
      case MoveType.getPosition:
        if (playerState.groupIndex !== undefined) {
          break;
        }
        let groupIndex = gameState.groups.findIndex(
          ({ playerNum }) => playerNum < groupSize
        );
        if (groupIndex === -1) {
          const group: IGroupState = {
            roundIndex: 0,
            playerNum: 0,
            rounds: Array(rounds)
              .fill(null)
              .map(() => ({
                strikePrice: undefined,
                strikeNum: undefined
              }))
          };
          groupIndex = gameState.groups.push(group) - 1;
        }
        playerState.groupIndex = groupIndex;
        playerState.positionIndex = gameState.groups[groupIndex].playerNum++;
        const positionParams = positions[playerState.positionIndex];
        playerState.role = positionParams.role;
        playerState.rounds = Array(rounds)
          .fill(null)
          .map((_, i) => ({
            status: PlayerStatus.prepared,
            startingPrice: positionParams.startingPrices[i],
            startingQuota: positionParams.startingQuotas[i],
            privateValue: positionParams.privateValues[i],
            price: undefined,
            bidNum: undefined,
            actualNum: 0,
            profit: 0
          }));
        break;
      case MoveType.shout: {
        const { roundIndex, price, num } = params;
        const playerRound = playerState.rounds[roundIndex];
        if (playerRound.price !== undefined) {
          return;
        }
        if (this.invalidParams(playerState, params)) {
          return cb(
            playerState.role === 0 ? "价格应不大于估值" : "价格应不小于估值"
          );
        }
        playerRound.price = price;
        playerRound.bidNum = num;
        playerRound.status = PlayerStatus.shouted;
        const playerStateArray = Object.values(playerStates).filter(
          ps => ps.groupIndex === playerState.groupIndex
        );
        if (
          playerStateArray.length < groupSize ||
          playerStateArray.some(ps => ps.rounds[roundIndex].price === undefined)
        ) {
          return;
        }
        const groupState = gameState.groups[playerState.groupIndex];
        this.processProfits(groupState, playerStateArray);
        this.tickNextRound(roundIndex, groupState, playerStateArray);
        break;
      }
      case MoveType.nextRound: {
        const { nextRoundIndex } = params;
        if (nextRoundIndex < rounds) {
          gameState.groups[playerState.groupIndex].roundIndex = nextRoundIndex;
        }
        break;
      }
    }
  }

  private tickNextRound(
    roundIndex: number,
    groupState: IGroupState,
    playerStates: Array<TPlayerState<IPlayerState>>
  ) {
    const { rounds } = this.game.params;
    if (roundIndex === rounds - 1) {
      return;
    }
    let newRoundTimer = 1;
    const newRoundInterval = global.setInterval(async () => {
      playerStates.forEach(({ actor }) =>
        this.push(actor, PushType.newRoundTimer, {
          roundIndex,
          newRoundTimer
        })
      );
      if (newRoundTimer++ < NEW_ROUND_TIMER) {
        return;
      }
      global.clearInterval(newRoundInterval);
      groupState.roundIndex = Math.min(groupState.roundIndex + 1, rounds - 1);
      await this.stateManager.syncState();
    }, 1000);
  }

  private invalidParams(
    playerState: IPlayerState,
    params: IMoveParams
  ): boolean {
    const { roundIndex, price, num } = params;
    const role = playerState.role;
    const { startingPrice, startingQuota, privateValue } = playerState.rounds[
      roundIndex
    ];
    return (
      !price ||
      !num ||
      (role === 0 && (price * num > startingPrice || price > privateValue)) ||
      (role == 1 && (num > startingQuota || price < privateValue))
    );
  }

  private processProfits(
    groupState: IGroupState,
    playerStates: Array<IPlayerState>
  ) {
    const { roundIndex, rounds } = groupState;
    const buyerList = playerStates
      .filter(ps => ps.role === 0)
      .map(ps => ps.rounds[roundIndex])
      .sort((a, b) => b.price - a.price);
    const sellerList = playerStates
      .filter(ps => ps.role === 1)
      .map(ps => ps.rounds[roundIndex])
      .sort((a, b) => a.price - b.price);
    const { strikePrice, strikeNum } = this._strikeDeal(buyerList, sellerList);
    this._updateGameState(rounds[roundIndex], strikePrice, strikeNum);
    this._updatePlayerStates(playerStates, roundIndex, strikePrice);
  }

  private _strikeDeal(
    buyerList: Array<IPlayerRoundState>,
    sellerList: Array<IPlayerRoundState>
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
    roundIndex: number,
    strikePrice: number
  ) {
    playerStates.forEach(ps => {
      const playerRound = ps.rounds[roundIndex];
      playerRound.status = PlayerStatus.result;
      if (!playerRound.actualNum) {
        return;
      }
      if (ps.role === 0) {
        playerRound.profit =
          (playerRound.privateValue - strikePrice) * playerRound.actualNum;
      } else {
        playerRound.profit =
          (strikePrice - playerRound.privateValue) * playerRound.actualNum;
      }
    });
  }

  private _updateGameState(
    roundState: IGameRoundState,
    strikePrice: number,
    strikeNum: number
  ) {
    roundState.strikePrice = strikePrice;
    roundState.strikeNum = strikeNum;
  }
}
