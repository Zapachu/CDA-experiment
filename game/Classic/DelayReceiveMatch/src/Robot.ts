import { Group, Round } from '@extend/robot'
import {
  ICreateParams,
  IGameRoundState,
  IGameState,
  IMoveParams,
  IPlayerRoundState,
  IPlayerState,
  IPushParams,
  IRoundCreateParams,
  MoveType,
  PushType
} from './config'

class RoundRobot extends Round.Round.Robot<
  IRoundCreateParams,
  IGameRoundState,
  IPlayerRoundState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  async init(): Promise<this> {
    return super.init()
  }
}

class GroupRobot extends Round.Robot<
  IRoundCreateParams,
  IGameRoundState,
  IPlayerRoundState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  RoundRobot = RoundRobot
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
