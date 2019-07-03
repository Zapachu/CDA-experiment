/**
 * 设置匹配时间
 *      如果未匹配到，则激活机器人进入，与玩家进行交互
 *      如果在规定时间内匹配到玩家，则玩家间相互交互
 * */

import { BaseRobot } from "@bespoke/robot";
import {
  MoveType,
  PushType,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  NPC_PRICE_MIN,
  NPC_PRICE_MAX,
  Role
} from "./config";
import { genRandomInt } from "./Controller";

export default class extends BaseRobot<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  async init():Promise<this> {
    await super.init();
    setTimeout(() => this.frameEmitter.emit(MoveType.join), 1000);
    this.frameEmitter.on(PushType.robotShout, () => {
      const { price, bidNum } = genPriceAndNum(this.playerState);
      setTimeout(() => this.frameEmitter.emit(MoveType.shout, { price, num: bidNum }), 1000);
    });
    return this;
  }
}

function genPriceAndNum(
  playerState: IPlayerState
): { price: number; bidNum: number } {
  if (playerState.role === Role.Buyer) {
    const price = _genPrice();
    const maxNum = Math.floor(playerState.startingPrice / price);
    const bidNum = genRandomInt(Math.floor(maxNum / 2), maxNum);
    return { price, bidNum };
  } else {
    const quota = playerState.startingQuota;
    const price = _genPrice();
    const bidNum = genRandomInt(Math.floor(quota / 2), quota);
    return { price, bidNum };
  }
}

function _genPrice(): number {
  return genRandomInt(NPC_PRICE_MIN * 100, NPC_PRICE_MAX * 100) / 100;
}
