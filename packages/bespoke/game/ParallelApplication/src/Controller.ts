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
import { GameOver } from "elf-protocol";
import {
  MoveType,
  PushType,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  SHOUT_TIMER,
  SCHOOL,
  APPLICATION_NUM,
  namespace
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
  private robotJoined = false;
  private shoutTimer: NodeJS.Timer;

  // initGameState(): TGameState<IGameState> {
  //   const gameState = super.initGameState();
  //   return gameState;
  // }

  // async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
  //   const playerState = await super.initPlayerState(actor);
  //   return playerState;
  // }

  protected async playerMoveReducer(
    actor: IActor,
    type: string,
    params: IMoveParams,
    cb: IMoveCallback
  ): Promise<void> {
    const { groupSize } = this.game.params;
    const playerState = await this.stateManager.getPlayerState(actor),
      // gameState = await this.stateManager.getGameState(),
      playerStates = await this.stateManager.getPlayerStates();
    switch (type) {
      case MoveType.join: {
        if (playerState.score !== undefined) {
          return;
        }
        this.initPlayer(playerState);
        if ((playerState.actor.type = baseEnum.Actor.serverRobot)) {
          this.push(playerState.actor, PushType.robotShout);
        }
        break;
      }
      case MoveType.shout: {
        if (playerState.schools !== undefined) {
          return;
        }
        if (this.invalidParams(params)) {
          return cb("请选择正确的学校投递");
        }
        playerState.schools = params.schools;
        const playerStateArray = Object.values(playerStates);
        if (!this.robotJoined && playerStateArray.length < groupSize) {
          // 第一次有人报价时补满机器人
          this.initRobots(groupSize - playerStateArray.length);
          this.robotJoined = true;
        }
        if (
          playerStateArray.length === groupSize &&
          playerStateArray.every(ps => ps.schools !== undefined)
        ) {
          this.processProfits(playerStateArray);
        }
        break;
      }
      case MoveType.back: {
        const { onceMore } = params;
        const res = await RedisCall.call<GameOver.IReq, GameOver.IRes>(
          GameOver.name,
          {
            playUrl: gameId2PlayUrl(this.game.id, actor.token),
            onceMore,
            namespace
          }
        );
        res ? cb(res.lobbyUrl) : null;
        break;
      }
    }
  }

  private invalidParams(params: IMoveParams): boolean {
    const { schools } = params;
    return (
      schools.length !== APPLICATION_NUM ||
      schools.some(s => {
        return (
          typeof s !== "number" ||
          s < SCHOOL.beijingUni ||
          s > SCHOOL.zhongshanUni
        );
      })
    );
  }

  private processProfits(playerStates: Array<IPlayerState>) {
    const enrollment = {
      [SCHOOL.beijingUni]: 0,
      [SCHOOL.qinghuaUni]: 0,
      [SCHOOL.renminUni]: 0,
      [SCHOOL.fudanUni]: 0,
      [SCHOOL.shangjiaoUni]: 0,
      [SCHOOL.zhejiangUni]: 0,
      [SCHOOL.nanjingUni]: 0,
      [SCHOOL.wuhanUni]: 0,
      [SCHOOL.huakeUni]: 0,
      [SCHOOL.nankaiUni]: 0,
      [SCHOOL.xiamenUni]: 0,
      [SCHOOL.zhongshanUni]: 0
    };
    const candidates = playerStates.sort((a, b) => b.score - a.score);
    candidates.forEach(ps => {
      let admission = SCHOOL.none;
      const schools = ps.schools;
      for (let i = 0; i < schools.length; i++) {
        const school = schools[i];
        if (enrollment[school] < QUOTA[school]) {
          admission = school;
          enrollment[school]++;
          break;
        }
      }
      ps.admission = admission;
    });
  }

  private initRobots(amount: number) {
    for (let i = 0; i < amount; i++) {
      this.startRobot(`Robot_${i}`);
    }
  }

  private initPlayer(playerState: IPlayerState) {
    const scores = this._getScores();
    playerState.scores = scores;
    playerState.score = scores.reduce((acc, item) => acc + item);
    // this._shoutTicking();
  }

  // private _shoutTicking() {
  //   if (this.shoutTimer) {
  //     return;
  //   }
  //   const { groupSize } = this.game.params;
  //   let shoutTime = 1;
  //   this.shoutTimer = setInterval(async () => {
  //     const playerStates = await this.stateManager.getPlayerStates();
  //     const playerStateArray = Object.values(playerStates);
  //     playerStateArray.forEach(s => {
  //       this.push(s.actor, PushType.shoutTimer, { shoutTime });
  //     });
  //     if (
  //       playerStateArray.length === groupSize &&
  //       playerStateArray.every(ps => ps.price !== undefined)
  //     ) {
  //       clearInterval(this.shoutTimer);
  //       return;
  //     }
  //     if (
  //       !this.robotJoined &&
  //       playerStateArray.length < groupSize &&
  //       SHOUT_TIMER - shoutTime < 30
  //     ) {
  //       // 倒计时30秒时补满机器人
  //       this.initRobots(groupSize - playerStateArray.length);
  //       this.robotJoined = true;
  //     }
  //     if (shoutTime++ < SHOUT_TIMER) {
  //       return;
  //     }
  //     clearInterval(this.shoutTimer);
  //     await this._shoutTickEnds(playerStateArray);
  //   }, 1000);
  // }

  // private async _shoutTickEnds(playerStates: Array<IPlayerState>) {
  //   const shoutedPlayerStates = playerStates.filter(ps => {
  //     if (ps.price === undefined) {
  //       ps.price = 0;
  //       ps.bidNum = 0;
  //       return false;
  //     }
  //     return true;
  //   });
  //   const gameState = await this.stateManager.getGameState();
  //   this.processProfits(gameState, shoutedPlayerStates);
  //   await this.stateManager.syncState();
  // }

  private _getScores(): Array<number> {
    const chinese = genRandomInt(80, 149);
    const maths = genRandomInt(80, 149);
    const english = genRandomInt(80, 149);
    const comprehensive = genRandomInt(160, 295);
    return [chinese, maths, english, comprehensive];
  }
}

const QUOTA = {
  [SCHOOL.beijingUni]: 1,
  [SCHOOL.qinghuaUni]: 1,
  [SCHOOL.renminUni]: 2,
  [SCHOOL.fudanUni]: 2,
  [SCHOOL.shangjiaoUni]: 2,
  [SCHOOL.zhejiangUni]: 2,
  [SCHOOL.nanjingUni]: 2,
  [SCHOOL.wuhanUni]: 2,
  [SCHOOL.huakeUni]: 2,
  [SCHOOL.nankaiUni]: 2,
  [SCHOOL.xiamenUni]: 3,
  [SCHOOL.zhongshanUni]: 3
};

export function genRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
