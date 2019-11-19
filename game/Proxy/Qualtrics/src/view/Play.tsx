import * as React from 'react'
import * as style from './style.scss'
import { MaskLoading } from '@elf/component'
import { Core } from '@bespoke/client'
import {
  getAncademyId,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  PushType
} from '../config'

export function Play({
  game: { params },
  playerState,
  frameEmitter
}: Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
  React.useEffect(() => {
    frameEmitter.emit(MoveType.getIndex)
  }, [])
  if (playerState.playerIndex === undefined) {
    return <MaskLoading />
  }
  return (
    <iframe
      className={style.playIframe}
      src={`${params.surveyUrl}?ancademyId=${getAncademyId(playerState.actor.token, playerState.playerIndex)}`}
    />
  )
}
