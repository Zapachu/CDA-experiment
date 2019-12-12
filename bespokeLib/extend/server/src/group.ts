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
    IGroupCreateParams,
    IGroupGameState,
    IGroupPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams
  > {
    constructor(
      private groupIndex: number,
      private stateManager: BespokeStateManager<
        GroupDecorator.ICreateParams<IGroupCreateParams>,
        GroupDecorator.IGameState<IGroupGameState>,
        GroupDecorator.TPlayerState<IGroupPlayerState>,
        MoveType,
        PushType,
        IMoveParams,
        IPushParams
      >
    ) {}

    async getPlayerState(
      index: number
    ): Promise<GroupDecorator.TPlayerState<IGroupPlayerState>> {
      const playerStates = await this.getPlayerStates();
      return playerStates[index];
    }

    async getGameState(): Promise<IGroupGameState> {
      const { groups } = await this.stateManager.getGameState();
      return groups[this.groupIndex].state;
    }

    async getPlayerStates(): Promise<
      GroupDecorator.TPlayerState<IGroupPlayerState>[]
    > {
      const playerStates: GroupDecorator.TPlayerState<IGroupPlayerState>[] = [];
      Object.values(
        await this.stateManager.getPlayerStates()
      ).forEach(playerState =>
        playerState.groupIndex === this.groupIndex
          ? (playerStates[playerState.index] = playerState)
          : null
      );
      return playerStates.sort((p1, p2) => p1.index - p2.index);
    }

    async syncState() {
      await this.stateManager.syncState();
    }
  }

  export class Logic<
    IGroupCreateParams,
    IGroupGameState,
    IGroupPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams
  > {
    constructor(
      protected gameId: string,
      protected groupIndex: number,
      protected groupSize: number,
      protected params: IGroupCreateParams,
      protected stateManager: StateManager<
        IGroupCreateParams,
        IGroupGameState,
        IGroupPlayerState,
        MoveType,
        PushType,
        IMoveParams,
        IPushParams
      >
    ) {}

    init(): this {
      return this;
    }

    initGameState(): IGroupGameState {
      return {} as any;
    }

    async initPlayerState(
      user: IUserWithId,
      groupIndex: number,
      index: number
    ): Promise<GroupDecorator.TPlayerState<IGroupPlayerState>> {
      return {
        user,
        groupIndex,
        index
      } as any;
    }

    async teacherMoveReducer(
      type: MoveType,
      params: IMoveParams,
      cb: IMoveCallback
    ): Promise<void> {}

    async playerMoveReducer(
      index: number,
      type: MoveType,
      params: IMoveParams,
      cb: IMoveCallback
    ): Promise<void> {}
  }
}

export class Logic<
  IGroupCreateParams,
  IGroupGameState,
  IGroupPlayerState,
  GroupMoveType,
  PushType,
  IGroupMoveParams,
  IPushParams
> extends BaseLogic<
  GroupDecorator.ICreateParams<IGroupCreateParams>,
  GroupDecorator.IGameState<IGroupGameState>,
  GroupDecorator.TPlayerState<IGroupPlayerState>,
  GroupDecorator.TMoveType<GroupMoveType>,
  PushType,
  GroupDecorator.IMoveParams<IGroupMoveParams>,
  IPushParams
> {
  GroupLogic: new (
    gameId: string,
    groupIndex: number,
    groupSize: number,
    params: IGroupCreateParams,
    stateManager: Group.StateManager<
      IGroupCreateParams,
      IGroupGameState,
      IGroupPlayerState,
      GroupMoveType,
      PushType,
      IGroupMoveParams,
      IPushParams
    >
  ) => Group.Logic<
    IGroupCreateParams,
    IGroupGameState,
    IGroupPlayerState,
    GroupMoveType,
    PushType,
    IGroupMoveParams,
    IPushParams
  >;

  groupsLogic: Group.Logic<
    IGroupCreateParams,
    IGroupGameState,
    IGroupPlayerState,
    GroupMoveType,
    PushType,
    IGroupMoveParams,
    IPushParams
  >[];

  init(): this {
    super.init();
    const {
      game: {
        id,
        params: { group, groupSize, groupsParams }
      }
    } = this;
    this.groupsLogic = Array(group)
      .fill(null)
      .map((_, i) =>
        new this.GroupLogic(
          id,
          i,
          groupSize,
          groupsParams[i],
          new Group.StateManager<
            IGroupCreateParams,
            IGroupGameState,
            IGroupPlayerState,
            GroupMoveType,
            PushType,
            IGroupMoveParams,
            IPushParams
          >(i, this.stateManager)
        ).init()
      );
    return this;
  }

  initGameState(): TGameState<GroupDecorator.IGameState<IGroupGameState>> {
    const gameState = super.initGameState();
    gameState.groups = Array(this.game.params.group)
      .fill(null)
      .map((_, i) => ({
        playerNum: 0,
        state: this.groupsLogic[i].initGameState()
      }));
    return gameState;
  }

  async teacherMoveReducer(
    actor: IActor,
    type: GroupDecorator.TMoveType<GroupMoveType>,
    params: GroupDecorator.IMoveParams<IGroupMoveParams>,
    cb: IMoveCallback
  ): Promise<void> {
    await this.groupsLogic[params.groupIndex].teacherMoveReducer(
      type as GroupMoveType,
      params.params,
      cb
    );
  }

  async playerMoveReducer(
    actor: IActor,
    type: GroupDecorator.TMoveType<GroupMoveType>,
    params: GroupDecorator.IMoveParams<IGroupMoveParams>,
    cb: IMoveCallback
  ): Promise<void> {
    const { groupSize } = this.game.params;
    const gameState = await this.stateManager.getGameState(),
      playerState = await this.stateManager.getPlayerState(actor);
    if (type === GroupDecorator.MoveType.getGroup) {
      if (playerState.groupIndex !== undefined) {
        return;
      }
      let groupIndex = gameState.groups.findIndex(
        group => group.playerNum < groupSize
      );
      if (groupIndex === -1) {
        return;
      }
      Object.assign(
        playerState,
        await this.groupsLogic[groupIndex].initPlayerState(
          playerState.user,
          groupIndex,
          gameState.groups[groupIndex].playerNum++
        )
      );
      await this.stateManager.syncState();
    } else {
      await this.groupsLogic[params.groupIndex].playerMoveReducer(
        playerState.index,
        type,
        params.params,
        cb
      );
    }
  }
}
