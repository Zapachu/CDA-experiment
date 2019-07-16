import {Extend} from '@extend/server'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from './config'

class GroupLogic extends Extend.GroupLogic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    initGameState(): IGameState {
        const gameState = super.initGameState()
        gameState.total = 0
        return gameState
    }

    async initPlayerState(): Promise<IPlayerState> {
        const playerState = await super.initPlayerState()
        playerState.count = 0
        return playerState
    }
}

export class Logic extends Extend.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    GroupLogic = GroupLogic
}