import {
  BaseController,
  baseEnum,
  gameId2PlayUrl,
  IActor,
  IMoveCallback,
  RedisCall,
  TGameState,
  TPlayerState,
  Actor,
  Model
} from "@bespoke/server";
import { config } from "@bespoke/share";
import { Trial } from "@elf/protocol";
import {
  MoveType,
  PushType,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  SHOUT_TIMER,
  namespace,
  GARBAGE
} from "./config";

const { FreeStyleModel } = Model;

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
  private ShoutTimeout: { [token: string]: NodeJS.Timeout } = {};

  // initGameState(): TGameState<IGameState> {
  //   const gameState = super.initGameState();
  //   return gameState;
  // }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const playerState = await super.initPlayerState(actor);
    playerState.score = 0;
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
      case MoveType.prepare: {
        if (playerState.answers !== undefined) {
          return;
        }
        this.initPlayer(playerState);
        if (playerState.actor.type === Actor.serverRobot) {
          this.push(playerState.actor, PushType.robotShout);
        }
        break;
      }
      case MoveType.check: {
        const { answer, index } = params;
        if (index >= ITEMS.length || playerState.answers[index] !== undefined) {
          return;
        }
        if (!answer) {
          return cb("请选择一种垃圾类别");
        }
        clearInterval(this.ShoutTimeout[playerState.actor.token]);
        const score = this.checkScore(answer, index);
        cb(null, score);
        break;
      }
      case MoveType.shout: {
        const { answer, index } = params;
        if (index >= ITEMS.length || playerState.answers[index] !== undefined) {
          return;
        }
        if (!answer) {
          return cb("请选择一种垃圾类别");
        }
        const playerStateArray = Object.values(playerStates);
        if (!this.robotJoined && playerStateArray.length < groupSize) {
          // 第一次有人报价时补满机器人
          this.initRobots(groupSize - playerStateArray.length);
          this.robotJoined = true;
        }
        this.processPlayerState(playerState, answer, index);
        this.shoutTicking(playerState);
        if (
          playerStateArray.length === groupSize &&
          playerStateArray.every(
            ps => ps.answers && ps.answers.length === ITEMS.length
          )
        ) {
          this.processGameState(gameState, playerStateArray);
        }
        break;
      }
      case MoveType.back: {
        const { onceMore } = params;
        const res = await RedisCall.call<Trial.Done.IReq, Trial.Done.IRes>(
          Trial.Done.name,
          {
            userId: playerState.user.id,
            onceMore,
            namespace
          }
        );
        res ? cb(res.lobbyUrl) : null;
        break;
      }
    }
  }

  private processPlayerState(
    playerState: TPlayerState<IPlayerState>,
    answer: GARBAGE,
    index: number
  ) {
    playerState.answers[index] = answer;
    if (answer === GARBAGE.pass) {
      return;
    }
    const score = this.checkScore(answer, index);
    playerState.score += score;
  }

  private checkScore(answer: GARBAGE, index: number): number {
    const { value, garbage } = ITEMS[index];
    if (answer === garbage) {
      return value;
    } else {
      return -value;
    }
  }

  private processGameState(
    gameState: IGameState,
    playerStates: Array<TPlayerState<IPlayerState>>
  ) {
    playerStates.sort((a, b) => b.score - a.score);
    const sortedPlayers = playerStates.map(ps => {
      return { score: ps.score };
    });
    const averageScore =
      sortedPlayers.reduce((acc, current) => acc + current.score, 0) /
      sortedPlayers.length;
    gameState.sortedPlayers = sortedPlayers;
    gameState.averageScore = averageScore;
  }

  private initRobots(amount: number) {
    for (let i = 0; i < amount; i++) {
      this.startRobot(`Robot_${i}`);
    }
  }

  private initPlayer(playerState: TPlayerState<IPlayerState>) {
    playerState.answers = [];
    this.shoutTicking(playerState);
  }

  private shoutTicking(playerState: TPlayerState<IPlayerState>) {
    if (playerState.actor.type === Actor.serverRobot) {
      return;
    }
    const token = playerState.actor.token;
    const index = playerState.answers.length;
    if (this.ShoutTimeout[token]) {
      clearInterval(this.ShoutTimeout[token]);
    }
    if (index === ITEMS.length) {
      return;
    }
    let shoutTimer = 0;
    this.ShoutTimeout[token] = setInterval(async () => {
      this.push(playerState.actor, PushType.shoutTimer, { shoutTimer });
      if (shoutTimer++ < SHOUT_TIMER) {
        return;
      }
      clearInterval(this.ShoutTimeout[token]);
      this.processPlayerState(playerState, GARBAGE.pass, index);
      if (index === ITEMS.length - 1) {
        this.checkAndProcessGameState();
      }
      await this.stateManager.syncState();
      this.shoutTicking(playerState);
    }, 1000) as any;
  }

  private async checkAndProcessGameState() {
    const { groupSize } = this.game.params;
    const playerStates = await this.stateManager.getPlayerStates();
    const playerStateArray = Object.values(playerStates);
    if (
      playerStateArray.length === groupSize &&
      playerStateArray.every(
        ps => ps.answers && ps.answers.length === ITEMS.length
      )
    ) {
      const gameState = await this.stateManager.getGameState();
      this.processGameState(gameState, playerStateArray);
      await this.stateManager.syncState();
    }
  }
}

export const ITEMS = [
  { value: 20, garbage: GARBAGE.dry },
  { value: 20, garbage: GARBAGE.dry },
  { value: 20, garbage: GARBAGE.dry },
  { value: 20, garbage: GARBAGE.dry },
  { value: 20, garbage: GARBAGE.dry },
  { value: 20, garbage: GARBAGE.dry },
  { value: 20, garbage: GARBAGE.dry },
  { value: 20, garbage: GARBAGE.dry },
  { value: 20, garbage: GARBAGE.dry },
  { value: 20, garbage: GARBAGE.dry }
];
