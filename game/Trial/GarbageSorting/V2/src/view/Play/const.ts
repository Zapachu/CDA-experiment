import {
    GarbageType,
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
    PushType
} from '../../config';
import {Core} from '@bespoke/client';
import {asset} from './asset';

export type TProps = Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>

export const CONST = {
    props: null as TProps,
    maxLife: 100,
    maxEnv: 100,
    envStep: 40,
};

export enum SceneName {
    mainGame = 'mainGame'
}

export const GarbageTypes = [GarbageType.harmful, GarbageType.kitchen, GarbageType.recyclable, GarbageType.other];

export function getGarbageConfig(g: GarbageType): { label: string, bodyName: string, coverName: string, bodySrc: string, coverSrc: string } {
    const [label, bodySrc, coverSrc] = {
        [GarbageType.harmful]: ['有害垃圾', asset.harmful, asset.harmful_c],
        [GarbageType.kitchen]: ['厨余垃圾', asset.kitchen, asset.kitchen_c],
        [GarbageType.recyclable]: ['可回收垃圾', asset.recyclable, asset.recyclable_c],
        [GarbageType.other]: ['其它垃圾', asset.other, asset.other_c],
    }[g];
    return {
        label,
        bodySrc,
        coverSrc,
        bodyName: `body_${g}`,
        coverName: `cover_${g}`
    };
}

