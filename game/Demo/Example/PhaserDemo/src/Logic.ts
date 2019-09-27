import {BaseLogic, IActor, IMoveCallback} from '@bespoke/server';
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from './config';

export default class Logic extends BaseLogic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {

    async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        switch (type) {
            case MoveType.move:
                this.broadcast(PushType.move, {token: actor.token, d: params.d});
        }
        return null;
    }
}
