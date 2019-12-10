import { FrameEmitter, IUserWithId } from "@bespoke/share";

export const GroupRange = {
  group: {
    min: 1,
    max: 12
  },
  groupSize: {
    min: 1,
    max: 12
  }
};

export namespace GroupDecorator {
  export enum GroupMoveType {
    getGroup = "getGroup"
  }

  export type MoveType<MoveType> = MoveType | GroupMoveType;

  export interface ICreateParams<IGroupCreateParams> {
    group: number;
    groupSize: number;
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

  export interface IGameState<IRoundGameState> {
    round: number;
    rounds: IRoundGameState[];
  }

  export type TPlayerState<IPlayerRoundState> = IPlayerRoundState & {
    status: PlayerStatus;
    rounds: IPlayerRoundState[];
  };
}
