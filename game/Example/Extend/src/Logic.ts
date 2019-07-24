import * as Extend from '@extend/server'
import {IActor, IMoveCallback} from '@bespoke/share'
import {Log} from '@elf/util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from './config'

class GroupLogic extends Extend.Group.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
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

    async teacherMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState()
        Log.d(gameState)
        switch (type) {
            case MoveType.reset:
                gameState.total = 0
        }
    }

    async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor)
        switch (type) {
            case MoveType.add:
                playerState.count++
                gameState.total++
        }
    }
}

export class Logic extends Extend.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    GroupLogic = GroupLogic
}