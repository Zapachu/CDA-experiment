import {
  BaseLogic,
  IActor,
  IMoveCallback,
  StateManager as BespokeStateManager,
  TGameState
} from "@bespoke/server";
import { GroupDecorator } from "@extend/share";
import { IUserWithId } from "@bespoke/share";

export namespace Group {
  export class StateManager<
    ICreateParams,
    IGameState,
    IPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams
  > {
    constructor(
      private groupIndex: number,
      private stateManager: BespokeStateManager<
        ICreateParams,
        GroupDecorator.IGameState<IGameState>,
        GroupDecorator.TPlayerState<IPlayerState>,
        MoveType,
        PushType,
        IMoveParams,
        IPushParams
      >
    ) {}

    async getPlayerState(
      actor: IActor
    ): Promise<GroupDecorator.TPlayerState<IPlayerState>> {
      return await this.stateManager.getPlayerState(actor);
    }

    async getGameState(): Promise<IGameState> {
      const { groups } = await this.stateManager.getGameState();
      return groups[this.groupIndex].state;
    }

    async getPlayerStates(): Promise<{
      [token: string]: GroupDecorator.TPlayerState<IPlayerState>;
    }> {
      const playerStates = {};
      Object.values(
        await this.stateManager.getPlayerStates()
      ).forEach(playerState =>
        playerState.groupIndex === this.groupIndex
          ? (playerStates[playerState.actor.token] = playerState)
          : null
      );
      return playerStates;
    }

    async syncState() {
      await this.stateManager.syncState();
    }
  }

  export class Logic<
    ICreateParams,
    IGameState,
    IPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams
  > {
    constructor(
      protected gameId: string,
      protected groupIndex: number,
      protected groupSize: number,
      protected params: ICreateParams,
      protected stateManager: StateManager<
        ICreateParams,
        IGameState,
        IPlayerState,
        MoveType,
        PushType,
        IMoveParams,
        IPushParams
      >
    ) {}

    initGameState(): IGameState {
      return {} as any;
    }

    async initPlayerState(
      user: IUserWithId,
      index: number
    ): Promise<GroupDecorator.TPlayerState<IPlayerState>> {
      return {
        user,
        index
      } as any;
    }

    async teacherMoveReducer(
      actor: IActor,
      type: MoveType,
      params: IMoveParams,
      cb: IMoveCallback
    ): Promise<void> {}

    async playerMoveReducer(
      actor: IActor,
      type: MoveType,
      params: IMoveParams,
      cb: IMoveCallback
    ): Promise<void> {}
  }
}

export class Logic<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> extends BaseLogic<
  GroupDecorator.ICreateParams<ICreateParams>,
  GroupDecorator.IGameState<IGameState>,
  GroupDecorator.TPlayerState<IPlayerState>,
  GroupDecorator.MoveType<MoveType>,
  PushType,
  GroupDecorator.IMoveParams<IMoveParams>,
  IPushParams
> {
  GroupLogic: new (
    gameId: string,
    groupIndex: number,
    groupSize: number,
    params: ICreateParams,
    stateManager: Group.StateManager<
      ICreateParams,
      IGameState,
      IPlayerState,
      MoveType,
      PushType,
      IMoveParams,
      IPushParams
    >
  ) => Group.Logic<
    ICreateParams,
    IGameState,
    IPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams
  >;

  groupsLogic: Group.Logic<
    ICreateParams,
    IGameState,
    IPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams
  >[];

  async init(): Promise<this> {
    await super.init();
    const {
      game: {
        id,
        params: { group, groupSize, groupsParams }
      }
    } = this;
    this.groupsLogic = Array(group)
      .fill(null)
      .map(
        (_, i) =>
          new this.GroupLogic(
            id,
            i,
            groupSize,
            groupsParams[i],
            new Group.StateManager<
              ICreateParams,
              IGameState,
              IPlayerState,
              MoveType,
              PushType,
              IMoveParams,
              IPushParams
            >(i, this.stateManager)
          )
      );
    return this;
  }

  initGameState(): TGameState<GroupDecorator.IGameState<IGameState>> {
    const gameState = super.initGameState();
    gameState.groups = Array(this.game.params.group)
      .fill(null)
      .map((_, i) => ({
        playerNum: 0,
        state: this.groupsLogic[i].initGameState()
      }));
    return gameState;
  }

  protected async teacherMoveReducer(
    actor: IActor,
    type: GroupDecorator.MoveType<MoveType>,
    params: GroupDecorator.IMoveParams<IMoveParams>,
    cb: IMoveCallback
  ): Promise<void> {
    await this.groupsLogic[params.groupIndex].teacherMoveReducer(
      actor,
      type as MoveType,
      params.params,
      cb
    );
    this.startRobot(Math.random());
  }

  protected async playerMoveReducer(
    actor: IActor,
    type: GroupDecorator.MoveType<MoveType>,
    params: GroupDecorator.IMoveParams<IMoveParams>,
    cb: IMoveCallback
  ): Promise<void> {
    const { groupSize } = this.game.params;
    const gameState = await this.stateManager.getGameState(),
      playerState = await this.stateManager.getPlayerState(actor);
    if (type === GroupDecorator.GroupMoveType.getGroup) {
      if (playerState.groupIndex !== undefined) {
        return;
      }
      let groupIndex = gameState.groups.findIndex(
        group => group.playerNum < groupSize
      );
      if (groupIndex === -1) {
        return;
      }
      playerState.groupIndex = groupIndex;
      Object.assign(
        playerState,
        await this.groupsLogic[groupIndex].initPlayerState(
          playerState.user,
          gameState.groups[groupIndex].playerNum++
        )
      );
      await this.stateManager.syncState();
    } else {
      await this.groupsLogic[params.groupIndex].playerMoveReducer(
        actor,
        type,
        params.params,
        cb
      );
    }
  }
}
