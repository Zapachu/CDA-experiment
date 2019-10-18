import {Actor, BaseController, IActor, IMoveCallback, Model, RedisCall, TPlayerState} from '@bespoke/server';
import {Trial} from '@elf/protocol';
import {
  GARBAGE,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  ITEM_COST,
  MoveType,
  namespace,
  PushType,
  SHOUT_TIMER
} from './config';

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
    playerState.score = 100;
    playerState.contribution = 0;
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
        if (answer !== GARBAGE.pass) {
          playerState.score -= ITEM_COST;
        }
        playerState.flyTo = undefined;
        const score = this.checkScore(answer, index);
        playerState.contribution += score;
        cb(null, score > 0);
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
        playerState.answers[index] = answer;
        if (playerState.actor.type === Actor.serverRobot) {
          if (answer !== GARBAGE.pass) {
            playerState.score -= ITEM_COST;
          }
          const score = this.checkScore(answer, index);
          playerState.contribution += score;
        }
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
        const res = await RedisCall.call<Trial.Done.IReq, Trial.Done.IRes>(
          Trial.Done.name,
          {
            userId: playerState.user.id,
            namespace
          }
        );
        res ? cb(res.lobbyUrl) : null;
        break;
      }
    }
  }

  private checkScore(answer: GARBAGE, index: number): number {
    const { value, garbage } = ITEMS[index];
    if (answer === garbage) {
      return value;
    } else {
      return 0;
    }
  }

  private processGameState(
    gameState: IGameState,
    playerStates: Array<TPlayerState<IPlayerState>>
  ) {
    const { groupSize } = this.game.params;
    const totalScore = playerStates.reduce(
      (acc, current) => acc + current.contribution,
      0
    );
    const averageScore = totalScore / groupSize;
    const sortedPlayers = playerStates
      .map(ps => {
        const finalScore = ps.score + averageScore;
        ps.score = finalScore;
        //@ts-ignore
        return { score: finalScore, img: ps.user.headimg };
      })
      .sort((a, b) => b.score - a.score);
    gameState.sortedPlayers = sortedPlayers;
    gameState.totalScore = totalScore;
    this.recordResult(playerStates);
  }

  private async recordResult(playerStates: Array<TPlayerState<IPlayerState>>) {
    playerStates.forEach(ps => {
      if (ps.actor.type !== Actor.player) {
        return;
      }
      new FreeStyleModel({
        game: this.game.id,
        key: ps.user.id,
        data: {
          score: ps.score
        }
      })
        .save()
        .catch(e => console.error(e));
    });
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
      playerState.flyTo = GARBAGE.pass;
      await this.stateManager.syncState();
      this.nextItem(playerState, GARBAGE.pass, index);
    }, 1000) as any;
  }

  private async nextItem(
    playerState: TPlayerState<IPlayerState>,
    answer: GARBAGE,
    index: number
  ) {
    setTimeout(async () => {
      playerState.answers[index] = answer;
      playerState.flyTo = undefined;
      if (index === ITEMS.length - 1) {
        this.checkAndProcessGameState();
      }
      await this.stateManager.syncState();
      this.shoutTicking(playerState);
    }, 1000);
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
  { value: 20, garbage: GARBAGE.hazardous },
  { value: 20, garbage: GARBAGE.kitchen },
  { value: 20, garbage: GARBAGE.recyclable },
  { value: 20, garbage: GARBAGE.hazardous },
  { value: 20, garbage: GARBAGE.recyclable },
  { value: 20, garbage: GARBAGE.other },
  { value: 20, garbage: GARBAGE.other },
  { value: 20, garbage: GARBAGE.recyclable },
  { value: 20, garbage: GARBAGE.recyclable },
  { value: 20, garbage: GARBAGE.kitchen }
];
