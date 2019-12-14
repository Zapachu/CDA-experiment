import * as React from 'react'
import { Group } from '@extend/client'
import * as style from './style.scss'
import { IRoundCreateParams, IGroupGameState, IGroupPlayerState } from '../config'

class GroupResult extends Group.Group.Result<IRoundCreateParams, IGroupGameState, IGroupPlayerState> {
  render(): React.ReactNode {
    const { playerState, gameState } = this.props
    return <section className={style.groupResult}>Game Closed</section>
  }
}

export class Result extends Group.Result<IRoundCreateParams, IGroupGameState, IGroupPlayerState> {
  GroupResult = GroupResult
}
