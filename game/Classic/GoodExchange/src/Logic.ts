import * as Extend from '@extend/server';
import {IActor, IMoveCallback, IUserWithId} from '@bespoke/share';
import {GroupDecorator} from '@extend/share';
import {Model} from '@bespoke/server';
import {
    ExchangeStatus,
    ICreateParams,
    IGameRoundState,
    IGameState,
    IMoveParams,
    IPlayerRoundState,
    IPlayerState,
    IPushParams,
    MoveType,
    PlayerStatus,
    PushType
} from './config';

class GroupLogic extends Extend.Group.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    initGameState(): IGameState {
        const gameState = super.initGameState();
        gameState.rounds = [];
        return gameState;
    }

    async initPlayerState(user: IUserWithId, index: number): Promise<GroupDecorator.TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(user, index);
        playerState.status = PlayerStatus.guide;
        playerState.rounds = [];
        return playerState;
    }

    async startRound(r: number) {
        const {round, minPrivateValue, maxPrivateValue} = this.params;
        if (r >= round) {
            return;
        }
        const gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates();
        gameState.round = r;
        const gameRoundState = {
            timeLeft: this.params.t,
            exchangeMatrix: Array(this.groupSize).fill(null).map(() => Array(this.groupSize).fill(null).map(() => ExchangeStatus.null)),
            allocation: Array(this.groupSize).fill(null)
        };
        gameState.rounds[r] = gameRoundState;
        Object.values(playerStates).forEach(p => p.rounds[r] = {
            privatePrices: Array(this.groupSize).fill(null).map(() => ~~(minPrivateValue + Math.random() * (maxPrivateValue - minPrivateValue)))
        });
        await this.stateManager.syncState();
        const timer = global.setInterval(async () => {
            if (gameState.round > r) {
                global.clearInterval(timer);
            }
            if (gameRoundState.timeLeft <= 1) {
                this.roundOver();
                global.clearInterval(timer);
            }
            gameRoundState.timeLeft--;
            await this.stateManager.syncState();
        }, 1e3);
    }

    async getState(): Promise<{
        gameState: IGameState,
        gameRoundState: IGameRoundState,
        playerStatesArr: GroupDecorator.TPlayerState<IPlayerState>[],
        playerRoundStates: IPlayerRoundState[]
    }> {
        const gameState = await this.stateManager.getGameState(),
            {round} = gameState,
            gameRoundState = gameState.rounds[round],
            playerStates = await this.stateManager.getPlayerStates(),
            playerStatesArr = Object.values<GroupDecorator.TPlayerState<IPlayerState>>(playerStates).sort((p1, p2) => p1.index - p2.index),
            playerRoundStates = playerStatesArr.map(({rounds}) => rounds[round]);
        return {
            gameState, gameRoundState, playerStatesArr, playerRoundStates
        };
    }

    async roundOver() {
        const {gameState, playerStatesArr, gameRoundState} = await this.getState(),
            {allocation} = gameState.rounds[gameState.round];
        allocation.forEach((good, i) => good === null ? allocation[i] = i : null);
        gameState.round < this.params.round - 1 ? this.startRound(gameState.round + 1) : playerStatesArr.forEach(p => p.status = PlayerStatus.result);
        await this.stateManager.syncState();
        await Model.FreeStyleModel.create({
            game: this.gameId,
            key: `${this.groupIndex}_${gameState.round}`,
            data: playerStatesArr.map(({user, index, rounds}) => {
                const {allocation} = gameRoundState;
                const {privatePrices} = rounds[gameState.round];
                return {
                    user: user.stuNum,
                    playerIndex: index + 1,
                    initGood: index + 1,
                    initGoodPrice: privatePrices[index],
                    good: allocation[index] + 1,
                    goodPrice: privatePrices[allocation[index]],
                };
            })
        });
    }

    async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {groupSize} = this;
        const {gameState, playerStatesArr, playerRoundStates} = await this.getState(),
            playerState = await this.stateManager.getPlayerState(actor),
            {round} = gameState,
            gameRoundState = gameState.rounds[round];
        switch (type) {
            case MoveType.guideDone: {
                playerState.status = PlayerStatus.round;
                if (playerStatesArr.length === groupSize && playerStatesArr.every(p => p.status === PlayerStatus.round)) {
                    this.startRound(0);
                }
                break;
            }
            case MoveType.exchange: {
                const {exchangeMatrix, allocation} = gameRoundState, {good} = params;
                if (exchangeMatrix[good][playerState.index] === ExchangeStatus.waiting) {
                    exchangeMatrix[good].fill(ExchangeStatus.null);
                    exchangeMatrix[good][playerState.index] = ExchangeStatus.exchanged;
                    exchangeMatrix[playerState.index].fill(ExchangeStatus.null);
                    exchangeMatrix[playerState.index][good] = ExchangeStatus.exchanged;
                    allocation[good] = playerState.index;
                    allocation[playerState.index] = good;
                } else {
                    exchangeMatrix[playerState.index][good] = ExchangeStatus.waiting;
                }
                if (allocation.every(p => p !== null)) {
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