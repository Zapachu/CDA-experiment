import { ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType } from '../../config'
import { Core } from '@bespoke/client'
import { FrameEmitter } from '@bespoke/share'

export * from '../../config'

export type TProps = Core.IPlayProps<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
>

export const PHASER_PARENT_ID = 'phaserParent'

export const Bridge = {
  emitter: null as FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>,
  props: null as TProps
}

export namespace Util {
  export function index2ChineseNumber(i: number) {
    return ['一', '二', '三'][i]
  }
}
