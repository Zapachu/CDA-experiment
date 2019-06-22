/**
 * 设置匹配时间
 *      如果未匹配到，则激活机器人进入，与玩家进行交互
 *      如果在规定时间内匹配到玩家，则玩家间相互交互
 * */

import { BaseRobot } from "bespoke-server";
import {
  MoveType,
  PushType,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  SCHOOL
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
  async init() {
    await super.init();
    setTimeout(() => this.frameEmitter.emit(MoveType.join), 1000);
    this.frameEmitter.on(PushType.robotShout, () => {
      const schools = selectSchools();
      setTimeout(
        () => this.frameEmitter.emit(MoveType.shout, { schools }),
        1000
      );
    });
    return this;
  }
}

function selectSchools(): Array<SCHOOL> {
  const first = genRandomInt(SCHOOL.beijingUni, SCHOOL.fudanUni);
  const second = genRandomInt(SCHOOL.shangjiaoUni, SCHOOL.wuhanUni);
  const third = genRandomInt(SCHOOL.huakeUni, SCHOOL.zhongshanUni);
  return [first, second, third];
}
