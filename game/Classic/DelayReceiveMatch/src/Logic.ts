import * as Extend from '@extend/server';
import {IActor, IMoveCallback, IUserWithId} from '@bespoke/share';
import {Wrapper} from '@extend/share';
import {
    CONFIG,
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
import {Model} from '@bespoke/server';
import {Log} from '@elf/util';
import {IPlayer, match} from './util/Match';

export class GroupLogic extends Extend.Group.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    initGameState(): IGameState {
        const gameState = super.initGameState();
        gameState.rounds = [];
        return gameState;
    }

    async initPlayerState(user: IUserWithId, index: number): Promise<Wrapper.TPlayerState<IPlayerState>> {
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
        gameState.rounds[r] = {
            timeLeft: CONFIG.tradeSeconds,
            allocation: []
        };
        Object.values(playerStates).forEach(p => p.rounds[r] = {
            status: PlayerRoundStatus.play,
            sort: [],
            privatePrices: Array(this.params.goodAmount).fill(null)
                .map(() => ~~(minPrivateValue + Math.random() * (maxPrivateValue - minPrivateValue)))
        });
        await this.stateManager.syncState();
    }

    async getState(): Promise<{
        gameState: IGameState,
        gameRoundState: IGameRoundState,
        playerStatesArr: Wrapper.TPlayerState<IPlayerState>[],
        playerRoundStates: IPlayerRoundState[]
    }> {
        const gameState = await this.stateManager.getGameState(),
            {round} = gameState,
            gameRoundState = gameState.rounds[round],
            playerStates = await this.stateManager.getPlayerStates(),
            playerStatesArr = Object.values<Wrapper.TPlayerState<IPlayerState>>(playerStates).sort((p1, p2) => p1.index - p2.index),
            playerRoundStates = playerStatesArr.map(({rounds}) => rounds[round]);
        return {
            gameState, gameRoundState, playerStatesArr, playerRoundStates
        };
    }

    match(players: IPlayer[]): number[] {
        Log.d(players);
        return match(players);
    }

    async roundOver() {
        const {gameState, gameRoundState, playerRoundStates, playerStatesArr} = await this.getState();
        const players: IPlayer[] = playerRoundStates.map(({sort}) => ({sort}));
        gameRoundState.allocation = match(players);
        if (gameState.round < this.params.round - 1) {
            playerRoundStates.forEach(p => p.status = PlayerRoundStatus.result);
            global.setTimeout(() => this.startRound(gameState.round + 1), 3e3);
        } else {
            playerStatesArr.forEach(p => p.status = PlayerStatus.result);
        }
        await this.stateManager.syncState();
        await Model.FreeStyleModel.create({
            game: this.gameId,
            key: `${this.groupIndex}_${gameState.round}`,
            data: playerStatesArr.map(({user, index, rounds}) => {
                const {allocation} = gameRoundState;
                const {privatePrices, sort} = rounds[gameState.round];
                return {
                    user: user.mobile,
                    playerIndex: index + 1,
                    sort: sort.map(i => i + 1).join('>'),
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