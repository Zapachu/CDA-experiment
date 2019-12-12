import { Group, Round } from '@extend/robot'
import {
  IGroupCreateParams,
  IGroupGameState,
  IGroupMoveParams,
  IGroupPlayerState,
  IPushParams,
  IRoundCreateParams,
  IRoundGameState,
  IRoundMoveParams,
  IRoundPlayerState,
  PushType,
  RoundMoveType
} from './config'

class RoundRobot extends Round.Round.Robot<
  IRoundCreateParams,
  IRoundGameState,
  IRoundPlayerState,
  RoundMoveType,
  PushType,
  IRoundMoveParams,
  IPushParams
> {
  async init(): Promise<this> {
    return super.init()
  }
}

class GroupRobot extends Round.Robot<
  IRoundCreateParams,
  IRoundGameState,
  IRoundPlayerState,
  RoundMoveType,
  PushType,
  IRoundMoveParams,
  IPushParams
> {
  RoundRobot = RoundRobot
}

export class Robot extends Group.Robot<
  IGroupCreateParams,
  IGroupGameState,
  IGroupPlayerState,
  RoundMoveType,
  PushType,
  IGroupMoveParams,
  IPushParams
> {
  GroupRobot = GroupRobot
}
