import {BaseController} from 'bespoke-server'
import {ICreateParams, IGameState, IPlayerState, IPushParams, IMoveParams} from './interface'
import {MoveType, PushType, FetchType} from './config'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
}
