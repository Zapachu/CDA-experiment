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
  universities: [
    '北京大学',
    '清华大学',
    '中国人民大学',
    '复旦大学',
    '上海交通大学',
    '浙江大学',
    '南京大学',
    '武汉大学',
    '华中科技大学',
    '南开大学',
    '厦门大学',
    '中山大学'
  ],
  ...CONFIG
}

export enum SceneName {
  boot = 'boot',
  chose = 'chose',
  confirm = 'confirm',
  match = 'match'
}
