import { IMoveCallback, IUserWithId } from "@bespoke/server";
import { GroupDecorator, RoundDecorator } from "@extend/share";
import { Group } from "./group";

export namespace Round {
  export class StateManager<
    IRoundCreateParams,
    IRoundGameState,
    IRoundPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams
  > {
    constructor(
      private roundIndex: number,
      private stateManager: Group.StateManager<
        RoundDecorator.ICreateParams<IRoundCreateParams>,
        RoundDecorator.IGameState<IRoundGameState>,
        RoundDecorator.IPlayerState<IRoundPlayerState>,
        MoveType,
        PushType,
        RoundDecorator.IMoveParams<IMoveParams>,
        IPushParams
      >
    ) {}

    async getPlayerState(index: number): Promise<IRoundPlayerState> {
      const { rounds } = await this.stateManager.getPlayerState(index);
      return rounds[this.roundIndex];
    }

    async getGameState(): Promise<IRoundGameState> {
      const { rounds } = await this.stateManager.getGameState();
      return rounds[this.roundIndex];
    }

    async getPlayerStates(): Promise<IRoundPlayerState[]> {
      const playerStates: IRoundPlayerState[] = [];
      Object.values(await this.stateManager.getPlayerStates()).forEach(
        playerState =>
          (playerStates[playerState.index] =
            playerState.rounds[this.roundIndex])
      );
      return playerStates;
    }

    async syncState() {
      await this.stateManager.syncState();
    }
  }

  export class Logic<
    IRoundCreateParams,
    IRoundGameState,
    IRoundPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams
  > {
    constructor(
      protected groupSize: number,
      protected groupIndex: number,
      protected roundIndex: number,
      protected params: IRoundCreateParams,
      protected stateManager: StateManager<
        IRoundCreateParams,
        IRoundGameState,
        IRoundPlayerState,
        MoveType,
        PushType,
        IMoveParams,
        IPushParams
      >,
      protected overCallback: () => Promise<void>
    ) {}

    async roundStart() {}

    initGameState(): IRoundGameState {
      return {} as any;
    }

    async initPlayerState(index: number): Promise<IRoundPlayerState> {
      return {} as any;
    }

    async playerMoveReducer(
      index: number,
      type: MoveType,
      params: IMoveParams,
      cb: IMoveCallback
    ): Promise<void> {}
  }
}

export class Logic<
  IRoundCreateParams,
  IRoundGameState,
  IRoundPlayerState,
  RoundMoveType,
  PushType,
  IRoundMoveParams,
  IPushParams
> extends Group.Logic<
  RoundDecorator.ICreateParams<IRoundCreateParams>,
  RoundDecorator.IGameState<IRoundGameState>,
  RoundDecorator.IPlayerState<IRoundPlayerState>,
  RoundDecorator.TMoveType<RoundMoveType>,
  PushType,
  RoundDecorator.IMoveParams<IRoundMoveParams>,
  IPushParams
> {
  RoundLogic: new (
    groupSize: number,
    groupIndex: number,
    roundIndex: number,
    params: IRoundCreateParams,
    stateManager: Round.StateManager<
      IRoundCreateParams,
      IRoundGameState,
      IRoundPlayerState,
      RoundMoveType,
      PushType,
      IRoundMoveParams,
      IPushParams
    >,
    overCallback: () => Promise<void>
  ) => Round.Logic<
    IRoundCreateParams,
    IRoundGameState,
    IRoundPlayerState,
    RoundMoveType,
    PushType,
    IRoundMoveParams,
    IPushParams
  >;

  roundsLogic: Round.Logic<
    IRoundCreateParams,
    IRoundGameState,
    IRoundPlayerState,
    RoundMoveType,
    PushType,
    IRoundMoveParams,
    IPushParams
  >[];

  init(): this {
    super.init();
    const {
      groupIndex,
      params: { round, roundsParams }
    } = this;
    this.roundsLogic = Array(round)
      .fill(null)
      .map(
        (_, i) =>
          new this.RoundLogic(
            this.groupSize,
            groupIndex,
            i,
            roundsParams[i],
            new Round.StateManager<
              IRoundCreateParams,
              IRoundGameState,
              IRoundPlayerState,
              RoundMoveType,
              PushType,
              IRoundMoveParams,
              IPushParams
            >(i, this.stateManager),
            async () => {
              await this.roundOverCallback();
              await this.startRound(i + 1);
            }
          )
      );
    return this;
  }

  initGameState(): RoundDecorator.IGameState<IRoundGameState> {
    const gameState = super.initGameState();
    gameState.rounds = Array(this.params.round)
      .fill(null)
      .map((_, i) => this.roundsLogic[i].initGameState());
    return gameState;
  }

  async initPlayerState(
    user: IUserWithId,
    groupIndex: number,
    index: number
  ): Promise<
    GroupDecorator.TPlayerState<RoundDecorator.IPlayerState<IRoundPlayerState>>
  > {
    const playerState = await super.initPlayerState(user, groupIndex, index);
    playerState.status = RoundDecorator.PlayerStatus.guide;
    playerState.rounds = [];
    for (let i = 0; i < this.params.round; i++) {
      playerState.rounds[i] = await this.roundsLogic[i].initPlayerState(index);
    }
    return playerState;
  }

  async playerMoveReducer(
    index: number,
    type: RoundDecorator.TMoveType<RoundMoveType>,
    params: RoundDecorator.IMoveParams<IRoundMoveParams>,
    cb: IMoveCallback
  ): Promise<void> {
    const { groupSize } = this,
      playerState = await this.stateManager.getPlayerState(index),
      playerStates = await this.stateManager.getPlayerStates();
    if (type === RoundDecorator.MoveType.guideDone) {
      {
        playerState.status = RoundDecorator.PlayerStatus.round;
        if (
          playerStates.length === groupSize &&
          playerStates.every(
            p => p.status === RoundDecorator.PlayerStatus.round
          )
        ) {
          this.startRound(0);
        }
      }
    } else {
      await this.roundsLogic[params.roundIndex].playerMoveReducer(
        index,
        type,
        params.params,
        cb
      );
    }
  }

  async roundOverCallback() {}

  async startRound(r: number) {
    const { round } = this.params;
    if (r < round) {
      const gameState = await this.stateManager.getGameState();
      gameState.round = r;
      await this.roundsLogic[r].roundStart();
    } else {
      const playerStates = await this.stateManager.getPlayerStates();
      playerStates.forEach(
        p => (p.status = RoundDecorator.PlayerStatus.result)
      );
    }
    await this.stateManager.syncState();
  }
}
