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
import {Core} from '@bespoke/client';

export type TProps = Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>

export const CONST = {
    overCallBack: ()=>null,
    props: null as TProps,
    envStep: 23,
    ...CONFIG
};

export enum SceneName {
    mainGame = 'mainGame'
}
