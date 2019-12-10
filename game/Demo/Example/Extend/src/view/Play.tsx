import * as React from 'react'
import { Group } from '@extend/client'
import { Button } from 'antd'
import { ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType } from '../config'

class GroupPlay extends Group.Group.Play<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  render(): React.ReactNode {
    const { playerState, groupGameState, frameEmitter } = this.props
    return (
      <>
        <h2>{playerState.count}</h2>
        <h2>{groupGameState.total}</h2>
        <Button onClick={() => frameEmitter.emit(MoveType.add)}>Add</Button>
      </>
    )
  }
}

export class Play extends Group.Play<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  GroupPlay = GroupPlay
}
