import {StateManager} from './StateManager';
import {Wrapper} from '@extend/share';
import {IActor, IMoveCallback, IUserWithId} from '@bespoke/share';

export class Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    constructor(protected gameId: string, protected groupIndex: number, protected groupSize: number, protected params: ICreateParams, protected stateManager: StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
    }

    initGameState(): IGameState {
        return {} as any;
    }

    async initPlayerState(user: IUserWithId, index: number): Promise<Wrapper.TPlayerState<IPlayerState>> {
        return {
            user,
            index
        } as any;
    }

    async teacherMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    }

    async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    }

}