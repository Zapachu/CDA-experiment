import * as React from 'react'
import { Group } from '@extend/client'
import { ICreateParams, IGameState, IPlayerState } from '../config'

class GroupResult extends Group.Group.Result<ICreateParams, IGameState, IPlayerState> {
  render(): React.ReactNode {
    const { playerState, groupGameState } = this.props
    return <></>
  }
}

export class Result extends Group.Result<ICreateParams, IGameState, IPlayerState> {
  GroupResult = GroupResult
}
