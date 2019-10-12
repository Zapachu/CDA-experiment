import * as Extend from '@extend/server';
import {IActor, IMoveCallback, IUserWithId} from '@bespoke/share';
import {GroupDecorator} from '@extend/share';
import {Model} from '@bespoke/server';
import {
    ICreateParams,
    IGameRoundState,
    IGameState,
    IMoveParams,
    IPlayerRoundState,
    IPlayerState,
    IPushParams,
    Mode,
    MoveType,
    PlayerRoundStatus,
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
        const {round} = this.params;
        if (r >= round) {
            return;
        }
        const gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates();
        gameState.round = r;
        const gameRoundState: IGameRoundState = {
            timeLeft: this.params.t,
            players: Array(this.groupSize).fill(null).map(() => ({
                x: 0,
                d: 0,
                extra: 0
            }))
        };
        gameState.rounds[r] = gameRoundState;
        Object.values(playerStates).forEach(p => p.rounds[r] = {
            status: PlayerRoundStatus.play
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
        const {gameState, playerStatesArr, gameRoundState, playerRoundStates} = await this.getState();
        gameRoundState.reward = ~~(gameRoundState.players.map(({x}) => this.params.M - x).reduce((m, n) => m + n, 0) * this.params.K / playerStatesArr.length);
        switch (this.params.mode) {
            case Mode.normal:
                break;
            case Mode.reward: {
                let rewardPlayerIndex = 0, dSum = 0;
                gameRoundState.players.forEach(({x, d}, i) => {
                    dSum += d;
                    if (x > gameRoundState.players[rewardPlayerIndex].x) {
                        rewardPlayerIndex = i;
                    }
                });
                gameRoundState.players[rewardPlayerIndex].extra = ~~(dSum * this.params.P);
                break;
            }
            case Mode.punish: {
                let rewardPlayerIndex = 0, dSum = 0;
                gameRoundState.players.forEach(({x, d}, i) => {
                    dSum += d;
                    if (x < gameRoundState.players[rewardPlayerIndex].x) {
                        rewardPlayerIndex = i;
                    }
                });
                gameRoundState.players[rewardPlayerIndex].extra = ~~(-dSum * this.params.P);
                break;
            }
        }
        playerRoundStates.forEach(p => p.status = PlayerRoundStatus.result);
        await this.stateManager.syncState();
        global.setTimeout(async () => {
            gameState.round < this.params.round - 1 ? this.startRound(gameState.round + 1) : playerStatesArr.forEach(p => p.status = PlayerStatus.result);
            await this.stateManager.syncState();
        }, 5e3);
        await Model.FreeStyleModel.create({
            game: this.gameId,
            key: `${this.groupIndex}_${gameState.round}`,
            data: playerStatesArr.map(({user, index}) => {
                const {reward} = gameRoundState,
                    {x, d, extra} = gameRoundState.players[index];
                return {
                    user: user.stuNum,
                    playerIndex: index + 1,
                    x,
                    d,
                    extra,
                    reward
                };
            })
        });
    }

    async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {groupSize} = this;
        const playerState = await this.stateManager.getPlayerState(actor),
            {gameState, playerStatesArr} = await this.getState(),
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
                Object.assign(gameRoundState.players[playerState.index], params);
                playerRoundState.status = PlayerRoundStatus.wait;
                if (gameRoundState.players.every((({x}) => x))) {
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