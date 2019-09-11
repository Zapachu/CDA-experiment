import * as Extend from '@extend/server';
import {IActor, IMoveCallback} from '@bespoke/share';
import {Wrapper} from '@extend/share';
import {
    CONFIG,
    GoodStatus,
    ICreateParams,
    IGameRoundState,
    IGameState,
    IMoveParams,
    IPlayerRoundState,
    IPlayerState,
    IPushParams,
    MoveType,
    PlayerRoundStatus,
    PlayerStatus,
    PushType
} from './config';
import {Log} from '@elf/util';
import shuffle = require('lodash/shuffle');

class GroupLogic extends Extend.Group.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    initGameState(): IGameState {
        const gameState = super.initGameState();
        gameState.rounds = [];
        return gameState;
    }

    async initPlayerState(index: number): Promise<Wrapper.TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(index);
        playerState.index = index;
        playerState.status = PlayerStatus.guide;
        playerState.rounds = [];
        return playerState;
    }

    async startRound(r: number) {
        const {round, oldPlayer, minPrivateValue, maxPrivateValue} = this.params;
        if (r >= round) {
            return;
        }
        const gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates();
        gameState.round = r;
        Log.d(oldPlayer, this.groupSize);
        gameState.rounds[r] = {
            timeLeft: CONFIG.tradeSeconds,
            goodStatus: shuffle([...Array(oldPlayer).fill(GoodStatus.old), ...Array(this.groupSize - oldPlayer).fill(GoodStatus.new)]),
            result: []
        };
        Object.values(playerStates).forEach(p => p.rounds[r] = {
            status: PlayerRoundStatus.play,
            sort: [],
            privatePrices: Array(this.groupSize).fill(null)
                .map(() => ~~(minPrivateValue + Math.random() * (maxPrivateValue - minPrivateValue)))
        });
        await this.stateManager.syncState();
        const tradeTimer = global.setInterval(() => {
            if (gameState.rounds[r].result.length) {

            }
        }, 1e3);
    }

    async getPlayerRoundStates(): Promise<Array<IPlayerRoundState>> {
        const gameState = await this.stateManager.getGameState(),
            {round} = gameState,
            playerStates = await this.stateManager.getPlayerStates(),
            playerStatesArr = Object.values(playerStates);
        return playerStatesArr.map(({rounds}) => rounds[round]);
    }

    async getState(): Promise<{
        gameState: IGameState,
        gameRoundState: IGameRoundState,
        playerStatesArr: IPlayerState[],
        playerRoundStates: IPlayerRoundState[]
    }> {
        const gameState = await this.stateManager.getGameState(),
            {round} = gameState,
            gameRoundState = gameState.rounds[round],
            playerStates = await this.stateManager.getPlayerStates(),
            playerStatesArr = Object.values(playerStates),
            playerRoundStates = await this.getPlayerRoundStates();
        return {
            gameState, gameRoundState, playerStatesArr, playerRoundStates
        };
    }

    async roundOver() {
        const {gameState, gameRoundState, playerRoundStates, playerStatesArr} = await this.getState();
        Log.d(playerRoundStates.map(({sort}) => sort));
        Log.d('TODO : Round Over', gameRoundState.result);
        if (gameState.round < this.params.round - 1) {
            playerRoundStates.forEach(p => p.status = PlayerRoundStatus.result);
            global.setTimeout(() => this.startRound(gameState.round + 1), 3e3);
        } else {
            playerStatesArr.forEach(p => p.status = PlayerStatus.result);
        }
        await this.stateManager.syncState();
    }

    async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {groupSize} = this;
        const {gameState, playerStatesArr, playerRoundStates} = await this.getState(),
            playerState = await this.stateManager.getPlayerState(actor),
            {round} = gameState,
            gameRoundState = gameState.rounds[round],
            playerRoundState = playerState.rounds[round];
        switch (type) {
            case MoveType.guideDone: {
                playerState.status = PlayerStatus.round;
                if (playerStatesArr.length === groupSize && playerStatesArr.every(p => p.status === PlayerStatus.round)) {
                    this.startRound(0);
                }
                break;
            }
            case MoveType.leave: {
                playerRoundState.status = PlayerRoundStatus.wait;
                gameRoundState.goodStatus[playerState.index] = GoodStatus.left;
                break;
            }
            case MoveType.submit: {
                playerRoundState.status = PlayerRoundStatus.wait;
                playerRoundState.sort = params.sort;
                if (playerRoundStates.every(p => p.status === PlayerRoundStatus.wait)) {
                    this.roundOver();
                }
                break;
            }
        }
    }
}

export class Logic extends Extend.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    GroupLogic = GroupLogic;
}