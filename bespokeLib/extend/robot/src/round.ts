import { Group } from "./group";
import { RoundDecorator } from "@extend/share";
import { config, FrameEmitter } from "@bespoke/share";

export namespace Round {
  export class Robot<
    IRoundCreateParams,
    IRoundGameState,
    IRoundPlayerState,
    RoundMoveType,
    PushType,
    IRoundMoveParams,
    IPushParams,
    IRobotMeta = any
  > {
    roundParams: IRoundCreateParams;
    roundFrameEmitter: FrameEmitter<
      RoundMoveType,
      PushType,
      IRoundMoveParams,
      IPushParams
    >;

    constructor(
      private host: Group.Robot<
        RoundDecorator.ICreateParams<IRoundCreateParams>,
        RoundDecorator.IGameState<IRoundGameState>,
        RoundDecorator.IPlayerState<IRoundPlayerState>,
        RoundDecorator.TMoveType<RoundMoveType>,
        PushType,
        RoundDecorator.IMoveParams<IRoundMoveParams>,
        IPushParams,
        IRobotMeta
      >,
      public round: number
    ) {
      const { groupParams, groupFrameEmitter } = host;
      this.roundParams = groupParams.roundsParams[this.round];
      this.roundFrameEmitter = groupFrameEmitter;
    }

    get roundPlayerState(): IRoundPlayerState {
      return this.host.playerState.rounds[this.round];
    }

    get roundGameState(): IRoundGameState {
      return this.host.groupGameState.rounds[this.round];
    }

    async init(): Promise<this> {
      return this;
    }
  }
}

export class Robot<
  IRoundCreateParams,
  IRoundGameState,
  IRoundPlayerState,
  RoundMoveType,
  PushType,
  IRoundMoveParams,
  IPushParams,
  IRobotMeta = {}
> extends Group.Robot<
  RoundDecorator.ICreateParams<IRoundCreateParams>,
  RoundDecorator.IGameState<IRoundGameState>,
  RoundDecorator.IPlayerState<IRoundPlayerState>,
  RoundDecorator.TMoveType<RoundMoveType>,
  PushType,
  RoundDecorator.IMoveParams<IRoundMoveParams>,
  IPushParams,
  IRobotMeta
> {
  RoundRobot: new (
    host: Robot<
      IRoundCreateParams,
      IRoundGameState,
      IRoundPlayerState,
      RoundMoveType,
      PushType,
      IRoundMoveParams,
      IPushParams,
      IRobotMeta
    >,
    round: number
  ) => Round.Robot<
    IRoundCreateParams,
    IRoundGameState,
    IRoundPlayerState,
    RoundMoveType,
    PushType,
    IRoundMoveParams,
    IPushParams,
    IRobotMeta
  >;

  roundRobot: Round.Robot<
    IRoundCreateParams,
    IRoundGameState,
    IRoundPlayerState,
    RoundMoveType,
    PushType,
    IRoundMoveParams,
    IPushParams,
    IRobotMeta
  >;

  async init(): Promise<this> {
    await super.init();
    this.groupFrameEmitter.emit(RoundDecorator.MoveType.guideDone);
    const interval = setInterval(async () => {
      if (this.playerState.status === RoundDecorator.PlayerStatus.guide) {
        return;
      }
      if (this.playerState.status === RoundDecorator.PlayerStatus.result) {
        clearInterval(interval);
      }
      if (
        !this.roundRobot ||
        this.groupGameState.round !== this.roundRobot.round
      ) {
        this.roundRobot = new this.RoundRobot(this, this.groupGameState.round);
        await this.roundRobot.init();
      }
    }, config.minMoveInterval);
    return this;
  }
}
