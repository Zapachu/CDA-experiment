import { Group } from '@extend/robot'
import { ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType } from './config'

export class GroupRobot extends Group.Group.Robot<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  async init(): Promise<this> {
    await super.init()
    return this
  }
}

export class Robot extends Group.Robot<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  GroupRobot = GroupRobot
}
