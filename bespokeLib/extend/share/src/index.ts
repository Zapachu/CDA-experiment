import { FrameEmitter, IUserWithId } from "@bespoke/share";

export namespace GroupDecorator {
  export enum MoveType {
    getGroup = "getGroup"
  }

  export enum ShowHistory {
    hide,
    selfOnly,
    showAll
  }

  export type TMoveType<GroupMoveType> = GroupMoveType | MoveType;

  export interface ICreateParams<IGroupCreateParams> {
    group: number;
    groupSize: number;
    independentGroup: boolean;
    showHistory: ShowHistory;
    groupsParams: IGroupCreateParams[];
  }

  export interface IMoveParams<IGroupMoveParams> {
    groupIndex: number;
    params: IGroupMoveParams;
  }

  export interface IGameState<IGroupGameState> {
    groups: Array<{
      playerNum: number;
      state: IGroupGameState;
    }>;
  }

  export type TPlayerState<IGroupPlayerState> = IGroupPlayerState & {
    index: number;
    user: IUserWithId;
    groupIndex: number;
  };

  export function groupFrameEmitter<
    GroupMoveType,
    PushType,
    IGroupMoveParams,
    IPushParams
  >(
    frameEmitter: FrameEmitter<
      GroupDecorator.TMoveType<GroupMoveType>,
      PushType,
      GroupDecorator.IMoveParams<IGroupMoveParams>,
      IPushParams
    >,
    groupIndex: number
  ): FrameEmitter<GroupMoveType, PushType, IGroupMoveParams, IPushParams> {
    const f = Object.create(frameEmitter);
    f.emit = (moveType, params, cb) =>
      frameEmitter.emit(moveType, { groupIndex, params }, cb);
    return f;
  }
}

export namespace RoundDecorator {
  export enum MoveType {
    guideDone = "guideDone"
  }

  export enum PlayerStatus {
    guide,
    round,
    result
  }

  export type TGroupMoveType<RoundMoveType> = RoundMoveType | MoveType;

  export interface IGroupCreateParams<IRoundCreateParams> {
    round: number;
    independentRound: boolean;
    roundsParams: IRoundCreateParams[];
  }

  export interface IGroupMoveParams<IRoundMoveParams> {
    roundIndex: number;
    params: IRoundMoveParams;
  }

  export interface IGroupGameState<IRoundGameState> {
    round: number;
    rounds: IRoundGameState[];
  }

  export interface IGroupPlayerState<IRoundPlayerState> {
    status: PlayerStatus;
    rounds: IRoundPlayerState[];
  }

  export function roundFrameEmitter<
    RoundMoveType,
    PushType,
    IRoundMoveParams,
    IPushParams
  >(
    frameEmitter: FrameEmitter<
      RoundDecorator.TGroupMoveType<RoundMoveType>,
      PushType,
      RoundDecorator.IGroupMoveParams<IRoundMoveParams>,
      IPushParams
    >,
    roundIndex: number
  ): FrameEmitter<RoundMoveType, PushType, IRoundMoveParams, IPushParams> {
    const f = Object.create(frameEmitter);
    f.emit = (moveType, params, cb) =>
      frameEmitter.emit(moveType, { roundIndex, params }, cb);
    return f;
  }
}
