import { ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType } from '../../config'
import { Core } from '@bespoke/client'

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
  row: 5,
  col: 5,
  tileSize: 80,
  tileSpacing: 8,
  tweenDuration: 400,
  localStorageName: '2048',
  backgroundColor: '#bbada0',
  minSwipe: {
    time: 300,
    magnitude: 80,
    normalization: 0.8
  },
  props: null as TProps
}

export enum SceneName {
  mainGame = 'mainGame'
}

export function span(tile: number, space: number = tile + 1) {
  return CONST.tileSpacing * ~~space + CONST.tileSize * tile
}

export function tileX(c: number) {
  return CONST.tileSpacing * (c + 1) + CONST.tileSize * (c + 0.5)
}

export function tileY(r: number) {
  return tileX(r + 3)
}
