import {
  CONFIG,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  PushType
} from '../../config'
import { Core } from '@bespoke/client'
import { FrameEmitter } from '@bespoke/share'

export type TProps = Core.IPlayProps<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
>

export const CONST = {
  emitter: null as FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>,
  phaserParent: 'phaserParent',
  ...CONFIG
}

export namespace Util {
  export function index2ChineseNumber(i: number) {
    return ['一', '二', '三'][i]
  }
}

export enum SceneName {
  boot = 'boot',
  chose = 'chose',
  confirm = 'confirm',
  match = 'match',
  result = 'result'
}
