import { FrameEmitter, IUserWithId } from "@bespoke/share";

export namespace GroupDecorator {
  export enum GroupMoveType {
    getGroup = "getGroup"
  }

  export enum ShowHistory {
    hide,
    selfOnly,
    showAll
  }

  export type MoveType<MoveType> = MoveType | GroupMoveType;

  export interface ICreateParams<IGroupCreateParams> {
    group: number;
    groupSize: number;
    showHistory: ShowHistory;
    groupsParams: IGroupCreateParams[];
  }

  export interface IMoveParams<IMoveParams> {
    groupIndex: number;
    params: IMoveParams;
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
    MoveType,
    PushType,
    IMoveParams,
    IPushParams
  >(
    frameEmitter: FrameEmitter<
      MoveType,
      PushType,
      GroupDecorator.IMoveParams<IMoveParams>,
      IPushParams
    >,
    groupIndex: number
  ): FrameEmitter<MoveType, PushType, IMoveParams, IPushParams> {
    const f = Object.create(frameEmitter);
    f.emit = (moveType, params, cb) =>
      frameEmitter.emit(moveType, { groupIndex, params }, cb);
    return f;
  }
}

export namespace RoundDecorator {
  export enum RoundMoveType {
    guideDone = "guideDone"
  }

  export enum PlayerStatus {
    guide,
    round,
    result
  }

  export type MoveType<MoveType> = MoveType | RoundMoveType;

  export interface ICreateParams<IRoundCreateParams> {
    round: number;
    roundsParams: IRoundCreateParams[];
  }

  export interface IMoveParams<IMoveParams> {
    roundIndex: number;
    params: IMoveParams;
  }

  export interface IGameState<IRoundGameState> {
    round: number;
    rounds: IRoundGameState[];
  }

  export interface IPlayerState<IPlayerRoundState> {
    status: PlayerStatus;
    rounds: IPlayerRoundState[];
  }
}
