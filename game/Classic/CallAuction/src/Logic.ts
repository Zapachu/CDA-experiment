import * as Extend from '@extend/server';
import {IActor, IMoveCallback, IUserWithId} from '@bespoke/share';
import {GroupDecorator} from '@extend/share';
import {Model} from '@bespoke/server';
import {
    ICreateParams,
    IGameRoundState,
    IGameState,
    IMoveParams,
    IOrder,
    IPlayerRoundState,
    IPlayerState,
    IPushParams,
    MoveType,
    PlayerRoundStatus,
    PlayerStatus,
    PushType,
    Role
} from './config';

class GroupLogic extends Extend.Group.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    static match(buyPrices: number[], sellPrices: number[]): Array<{ buy: number, sell: number }> {
        const result: Array<{ buy: number, sell: number }> = [];
        let k = 0;
        for (let i = 0; i < buyPrices.length; i++) {
            for (let j = k; j < sellPrices.length; j++) {
                if (buyPrices[i] === 0 || sellPrices[i] === 0) {
                    continue;
                }
                if (buyPrices[i] >= sellPrices[j]) {
                    result.push({buy: i, sell: j});
                    k = j + 1;
                    break;
                }
            }
        }
        return result;
    }

    private static privatePrice([min, max]: [number, number]) {
        return ~~(min + Math.random() * (max - min));
    }

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
            trades: []
        };
        gameState.rounds[r] = gameRoundState;
        Object.values(playerStates).forEach(p => p.rounds[r] = {
            status: PlayerRoundStatus.play,
            price: 0
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
        let buyOrders: IOrder[] = [], sellOrders: IOrder[] = [];
        playerStatesArr.map(({role, index}) => (role === Role.buyer ? buyOrders : sellOrders).push({
            player: index,
            price: playerRoundStates[index].price
        }));
        buyOrders = buyOrders.sort((b1, b2) => b1.price - b2.price);
        sellOrders = sellOrders.sort((s1, s2) => s2.price - s1.price);
        const trades = GroupLogic.match(buyOrders.map(({price}) => price), sellOrders.map(({price}) => price));
        gameRoundState.trades = trades.map(({buy, sell}) => ({
            buy: buyOrders[buy],
            sell: sellOrders[sell]
        }));
        playerRoundStates.forEach(p => p.status = PlayerRoundStatus.result);
        await this.stateManager.syncState();
        global.setTimeout(async () => {
            gameState.round < this.params.round - 1 ? this.startRound(gameState.round + 1) : playerStatesArr.forEach(p => p.status = PlayerStatus.result);
            await this.stateManager.syncState();
        }, 5e3);
        await Model.FreeStyleModel.create({
            game: this.gameId,
            key: `${this.groupIndex}_${gameState.round}`,
            data: gameRoundState.trades
        });
    }

    async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {groupSize} = this;
        const playerState = await this.stateManager.getPlayerState(actor),
            {gameState, playerStatesArr, playerRoundStates} = await this.getState(),
            {round} = gameState,
            playerRoundState = playerState.rounds[round];
        switch (type) {
            case MoveType.guideDone: {
                playerState.status = PlayerStatus.round;
                playerState.role = playerState.index % 2 ? Role.buyer : Role.seller;
                playerState.privatePrices = Array(this.params.round).fill(null).map(() => GroupLogic.privatePrice(playerState.role === Role.buyer ? this.params.buyPriceRange : this.params.sellPriceRange));
                if (playerStatesArr.length === groupSize && playerStatesArr.every(p => p.status === PlayerStatus.round)) {
                    this.startRound(0);
                }
                break;
            }
            case MoveType.shout: {
                const {price} = params;
                playerRoundState.price = price;
                playerRoundState.status = PlayerRoundStatus.wait;
                if (playerRoundStates.every(({price}) => price)) {
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
