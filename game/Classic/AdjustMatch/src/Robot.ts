import { Group } from '@extend/robot'
import {
  IGroupGameState,
  IGroupPlayerState,
  IPushParams,
  IRoundCreateParams,
  IRoundMoveParams,
  PushType,
  RoundMoveType
} from './config'

export class GroupRobot extends Group.Group.Robot<
  IRoundCreateParams,
  IGroupGameState,
  IGroupPlayerState,
  RoundMoveType,
  PushType,
  IRoundMoveParams,
  IPushParams
> {
  async init(): Promise<this> {
    await super.init()
    return this
  }
}

export class Robot extends Group.Robot<
  IRoundCreateParams,
  IGroupGameState,
  IGroupPlayerState,
  RoundMoveType,
  PushType,
  IRoundMoveParams,
  IPushParams
> {
  GroupRobot = GroupRobot
}
