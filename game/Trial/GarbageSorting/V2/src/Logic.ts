import {BaseLogic, IActor, IMoveCallback, TGameState, TPlayerState} from '@bespoke/server';
import {
    CONFIG,
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
    PlayerStatus,
    PushType
} from './config';

export default class Logic extends BaseLogic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState();
        gameState.env = CONFIG.maxEnv;
        return gameState;
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor);
        playerState.status = PlayerStatus.play;
        playerState.garbageIndex = 0;
        playerState.life = CONFIG.maxLife;
        return playerState;
    }

    async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor);
        switch (type) {
            case MoveType.submit:
                gameState.env -= 1;
                playerState.life -= 10;
                if (playerState.garbageIndex < CONFIG.garbageAmount - 1) {
                    playerState.garbageIndex++;
                } else {
                    playerState.status = PlayerStatus.wait;
                }
                this.broadcast(PushType.sync, {
                    token: actor.token,
                    t: params.t,
                    ...gameState,
                    ...playerState
                });
        }
        return null;
    }
}
