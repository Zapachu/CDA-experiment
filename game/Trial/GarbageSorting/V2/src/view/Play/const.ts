import {
    CONFIG,
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
    PushType
} from '../../config';
import {Core,} from '@bespoke/client';
import {FrameEmitter} from '@bespoke/share';

export type TProps = Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>

export const CONST = {
    overCallBack: () => null,
    emitter: null as FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>,
    envStep: 230,
    ...CONFIG
};

export enum SceneName {
    mainGame = 'mainGame'
}
