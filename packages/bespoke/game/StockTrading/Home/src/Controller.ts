import {BaseController, IActor, IMoveCallback} from 'bespoke-server'
import {MoveType, PushType, FetchType} from './config'
import {ICreateParams, IGameState, IPlayerState, IMoveParams, IPushParams} from './interface'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {

    async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    }
}