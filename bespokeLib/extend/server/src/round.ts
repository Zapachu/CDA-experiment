import { IMoveCallback, IUserWithId } from "@bespoke/server";
import { GroupDecorator, RoundDecorator } from "@extend/share";
import { Group } from "./group";
import shuffle = require("lodash/shuffle");

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
        RoundDecorator.IGroupCreateParams<IRoundCreateParams>,
        RoundDecorator.IGroupGameState<IRoundGameState>,
        RoundDecorator.IGroupPlayerState<IRoundPlayerState>,
        MoveType,
        PushType,
        RoundDecorator.IGroupMoveParams<IMoveParams>,
        IPushParams
      >
    ) {}

    async getPlayerState(index: number): Promise<IRoundPlayerState> {
      const playerStates = await this.getPlayerStates()
      return playerStates[index];
    }

    async getGameState(): Promise<IRoundGameState> {
      const { rounds } = await this.stateManager.getGameState();
      return rounds[this.roundIndex];
    }

    async getPlayerStates(): Promise<IRoundPlayerState[]> {
      const playerStates: IRoundPlayerState[] = [];
      Object.values(await this.stateManager.getPlayerStates()).forEach(
        groupPlayerState => {
          const roundPlayerState = groupPlayerState.rounds[this.roundIndex];
          playerStates[roundPlayerState.index] = roundPlayerState;
        }
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

    initGameState(): RoundDecorator.TRoundGameState<IRoundGameState> {
      return {
        indices: shuffle(
          Array(this.groupSize)
            .fill(null)
            .map((_, i) => i)
        )
      } as any;
    }

    async initPlayerState(
      index: number
    ): Promise<RoundDecorator.TRoundPlayerState<IRoundPlayerState>> {
      return { index } as any;
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
  RoundDecorator.IGroupCreateParams<IRoundCreateParams>,
  RoundDecorator.IGroupGameState<IRoundGameState>,
  RoundDecorator.IGroupPlayerState<IRoundPlayerState>,
  RoundDecorator.TGroupMoveType<RoundMoveType>,
  PushType,
  RoundDecorator.IGroupMoveParams<IRoundMoveParams>,
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
              await this.stateManager.syncState();
              global.setTimeout(async () => await this.startRound(i + 1), 10e3);
            }
          )
      );
    return this;
  }

  initGameState(): RoundDecorator.IGroupGameState<IRoundGameState> {
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
    GroupDecorator.TPlayerState<
      RoundDecorator.IGroupPlayerState<IRoundPlayerState>
    >
  > {
    const gameState = await this.stateManager.getGameState(),
      playerState = await super.initPlayerState(user, groupIndex, index);
    playerState.status = RoundDecorator.PlayerStatus.guide;
    playerState.rounds = [];
    for (let r = 0; r < this.params.round; r++) {
      playerState.rounds[r] = await this.roundsLogic[r].initPlayerState(
        gameState.rounds[r].indices[index]
      );
    }
    return playerState;
  }

  async playerMoveReducer(
    index: number,
    type: RoundDecorator.TGroupMoveType<RoundMoveType>,
    params: RoundDecorator.IGroupMoveParams<IRoundMoveParams>,
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
        playerState.rounds[params.roundIndex].index,
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
