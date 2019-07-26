import {StateManager} from './StateManager'
import {IActor, IMoveCallback} from '@bespoke/share'

export class Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    constructor(protected params: ICreateParams, protected stateManager: StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
    }

    initGameState(): IGameState {
        return {} as any
    }

    async initPlayerState(): Promise<IPlayerState> {
        return {} as any
    }

    async teacherMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    }

    async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    }

}