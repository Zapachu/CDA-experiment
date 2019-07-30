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
  GARBAGE
} from "./config";
import { ITEMS } from "./Controller";

export default class extends BaseRobot<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  async init() {
    await super.init();
    setTimeout(() => this.frameEmitter.emit(MoveType.prepare), 1000);
    this.frameEmitter.on(PushType.robotShout, () => this.shoutIndex(0));
    return this;
  }

  private shoutIndex(index: number) {
    if (index >= ITEMS.length) {
      return;
    }
    setTimeout(() => {
      this.frameEmitter.emit(MoveType.shout, {
        answer: genRandomGarbage(),
        index
      });
      this.shoutIndex(index + 1);
    }, 1000);
  }
}

function genRandomGarbage(): GARBAGE {
  // const arr = Object.values(GARBAGE);
  // const garbages = arr.slice(arr.length / 2);
  const garbages = [
    GARBAGE.pass,
    GARBAGE.dry,
    GARBAGE.wet,
    GARBAGE.recyclable,
    GARBAGE.hazardous
  ];
  const rand = genRandomInt(0, garbages.length - 1);
  return garbages[rand];
}

function genRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
