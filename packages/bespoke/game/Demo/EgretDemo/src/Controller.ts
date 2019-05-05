import {BaseController, IActor, IMoveCallback} from 'bespoke-server'
import {ICreateParams, IGameState, IPlayerState, IPushParams, IMoveParams} from './interface'
import {MoveType, PushType, FetchType} from './config'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {

    async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        switch (type) {
        }
    }
}
