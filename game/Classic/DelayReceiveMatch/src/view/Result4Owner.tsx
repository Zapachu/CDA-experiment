import * as React from 'react'
import * as style from './style.scss'
import { Core, Request } from '@bespoke/client'
import {
  FetchRoute,
  IGroupCreateParams,
  IGroupGameState,
  IGroupMoveParams,
  IGroupPlayerState,
  namespace,
  RoundMoveType
} from '../config'

export function Result4Owner({
  game
}: Core.IResult4OwnerProps<IGroupCreateParams, IGroupGameState, IGroupPlayerState, RoundMoveType, IGroupMoveParams>) {
  return (
    <section className={style.groupResult4Owner}>
      <a
        href={Request.instance(namespace).buildUrl(
          FetchRoute.exportXls,
          { gameId: game.id },
          {
            group: 0,
            round: 0
          }
        )}
      >
        导出记录
      </a>
    </section>
  )
}
