import * as React from 'react'
import * as Extend from '@extend/client'
import * as style from './style.scss'
import { ICreateParams, IGameState, IPlayerState } from '../config'

class GroupResult extends Extend.Group.Result<ICreateParams, IGameState, IPlayerState> {
  render(): React.ReactNode {
    const { playerState, gameState } = this.props
    return <section className={style.groupResult}>Game Closed</section>
  }
}

export class Result extends Extend.Result<ICreateParams, IGameState, IPlayerState> {
  GroupResult = GroupResult
}
