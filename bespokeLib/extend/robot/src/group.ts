import { BaseRobot } from "@bespoke/robot";
import { GroupDecorator } from "@extend/share";
import { config, FrameEmitter, TPlayerState } from "@bespoke/share";

export namespace Group {
  export class Robot<
    IGroupCreateParams,
    IGroupGameState,
    IGroupPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams,
    IRobotMeta = any
  > {
    groupParams: IGroupCreateParams;
    groupFrameEmitter: FrameEmitter<
      MoveType,
      PushType,
      IMoveParams,
      IPushParams
    >;

    constructor(
      private host: BaseRobot<
        GroupDecorator.ICreateParams<IGroupCreateParams>,
        GroupDecorator.IGameState<IGroupGameState>,
        GroupDecorator.TPlayerState<IGroupPlayerState>,
        GroupDecorator.MoveType<MoveType>,
        PushType,
        GroupDecorator.IMoveParams<IMoveParams>,
        IPushParams,
        IRobotMeta
      >
    ) {
      const {
        playerState: { groupIndex },
        game,
        frameEmitter
      } = host;
      this.groupParams = game.params.groupsParams[groupIndex];
      this.groupFrameEmitter = GroupDecorator.groupFrameEmitter(
        frameEmitter,
        groupIndex
      );
    }

    get meta(): IRobotMeta {
      return this.host.meta;
    }

    get playerState(): TPlayerState<IGroupPlayerState> {
      return this.host.playerState;
    }

    get groupGameState(): IGroupGameState {
      const {
        host: {
          gameState,
          playerState: { groupIndex }
        }
      } = this;
      return gameState.groups[groupIndex].state;
    }

    async init(): Promise<this> {
      return this;
    }
  }
}

export class Robot<
  IGroupCreateParams,
  IGroupGameState,
  IGroupPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  IRobotMeta = {}
> extends BaseRobot<
  GroupDecorator.ICreateParams<IGroupCreateParams>,
  GroupDecorator.IGameState<IGroupGameState>,
  GroupDecorator.TPlayerState<IGroupPlayerState>,
  GroupDecorator.MoveType<MoveType>,
  PushType,
  GroupDecorator.IMoveParams<IMoveParams>,
  IPushParams,
  IRobotMeta
> {
  GroupRobot: new (
    host: Robot<
      IGroupCreateParams,
      IGroupGameState,
      IGroupPlayerState,
      MoveType,
      PushType,
      IMoveParams,
      IPushParams,
      IRobotMeta
    >
  ) => Group.Robot<
    IGroupCreateParams,
    IGroupGameState,
    IGroupPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams,
    IRobotMeta
  >;

  groupRobot: Group.Robot<
    IGroupCreateParams,
    IGroupGameState,
    IGroupPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams,
    IRobotMeta
  >;

  async init(): Promise<this> {
    await super.init();
    this.frameEmitter.emit(GroupDecorator.GroupMoveType.getGroup);
    const interval = setInterval(async () => {
      if (this.playerState && this.playerState.groupIndex !== undefined) {
        clearInterval(interval);
        this.groupRobot = new this.GroupRobot(this);
        await this.groupRobot.init();
      }
    }, config.minMoveInterval);
    return this;
  }
}
