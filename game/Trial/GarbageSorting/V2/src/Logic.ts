import {BaseLogic, IActor, IMoveCallback} from '@bespoke/server';
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from './config';

export default class Logic extends BaseLogic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {

    async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        switch (type) {
            case MoveType.sort:
                this.broadcast(PushType.sort, {token: actor.token, t: params.t});
        }
        return null;
    }
}
