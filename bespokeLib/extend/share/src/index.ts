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

  export type TMoveType<RoundMoveType> = RoundMoveType | MoveType;

  export interface ICreateParams<IRoundCreateParams> {
    round: number;
    roundsParams: IRoundCreateParams[];
  }

  export interface IMoveParams<IRoundMoveParams> {
    roundIndex: number;
    params: IRoundMoveParams;
  }

  export interface IGameState<IRoundGameState> {
    round: number;
    rounds: IRoundGameState[];
  }

  export interface IPlayerState<IPlayerRoundState> {
    status: PlayerStatus;
    rounds: IPlayerRoundState[];
  }

  export function roundFrameEmitter<
    RoundMoveType,
    PushType,
    IRoundMoveParams,
    IPushParams
    >(
    frameEmitter: FrameEmitter<
      RoundDecorator.TMoveType<RoundMoveType>,
      PushType,
      RoundDecorator.IMoveParams<IRoundMoveParams>,
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
