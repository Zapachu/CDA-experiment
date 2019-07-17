import {Extend} from '@extend/server'
import {IActor, IMoveCallback} from '@bespoke/share'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from './config'

class InnerLogic extends Extend.Inner.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
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
    InnerLogic = InnerLogic
}