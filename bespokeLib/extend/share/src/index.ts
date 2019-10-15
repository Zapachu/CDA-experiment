import {FrameEmitter, IUserWithId} from '@bespoke/share';

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
        getGroup = 'getGroup'
    }

    export type MoveType<MoveType> = MoveType | GroupMoveType

    export interface ICreateParams<ICreateParams> {
        group: number
        groupSize: number
        groupsParams: ICreateParams[]
    }

    export interface IMoveParams<IMoveParams> {
        groupIndex: number
        params: IMoveParams
    }

    export interface IGameState<IGameState> {
        groups: Array<{
            playerNum: number
            state: IGameState
        }>
    }

    export type TPlayerState<IPlayerState> = IPlayerState & {
        index: number
        user: IUserWithId
        groupIndex: number
    }

    export function groupFrameEmitter<MoveType, PushType, IMoveParams, IPushParams>(frameEmitter: FrameEmitter<MoveType, PushType, GroupDecorator.IMoveParams<IMoveParams>, IPushParams>, groupIndex: number): FrameEmitter<MoveType, PushType, IMoveParams, IPushParams> {
        const f = Object.create(frameEmitter);
        f.emit = (moveType, params, cb) => frameEmitter.emit(moveType, {groupIndex, params}, cb);
        return f;
    }
}
