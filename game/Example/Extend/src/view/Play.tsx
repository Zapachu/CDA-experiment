import * as React from 'react'
import {Extend} from '@extend/register'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from '../config'

export class Play extends Extend.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {

}