import * as Extend from '@extend/robot'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from './config'

export class GroupRobot extends Extend.Group.Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>{

}

export class Robot extends Extend.Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    GroupRobot = GroupRobot
}