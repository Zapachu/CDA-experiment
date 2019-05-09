//region protocol
enum MoveType {
    greet = 'greet'
}

enum PushType {
    greet = 'greet'
}

enum FetchType {

}

interface ICreateParams {
}

interface IMoveParams {
}

interface IPushParams {
}

interface IGameState {
}

interface IPlayerState {
}
//endregion

import {BaseController, IActor, IMoveCallback} from 'bespoke-server'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {

    async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        switch (type) {
            case MoveType.greet:{
                this.broadcast(PushType.greet, actor)
            }
        }
    }
}

