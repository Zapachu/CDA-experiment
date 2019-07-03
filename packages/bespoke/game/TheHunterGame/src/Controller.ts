import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from '@bespoke/core'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import { MoveType, PlayerStatus, PushType, Prey} from './config'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.calendar = []
        gameState.nextDay = 0
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        const gameState = await this.stateManager.getGameState()
        if(playerState.playerStatus !== undefined) {
            return playerState;
        }
        playerState.day = gameState.nextDay++;
        playerState.hasChoice = this.genRandomInt(0, 4) < 4; //80%
        if(playerState.hasChoice) {
            playerState.prey = Prey.None;
        } else {
            playerState.prey = [Prey.Deer, Prey.Rabbit][this.genRandomInt(0, 1)]; //50%选择一个猎物
        }
        playerState.hasPen = this.genRandomInt(0, 3) === 0; //25%
        if(playerState.hasPen) {
            gameState.calendar.push({day: playerState.day, prey: Prey.None});
        }
        playerState.playerStatus === PlayerStatus.waiting;
        playerState.prevPrey = Prey.None;
        playerState.nextPrey = Prey.None;
        playerState.mistPrey = Prey.None;
        playerState.profit = null;
        return playerState
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {game: {params: {x, y, z, price1, price2}}} = this
        const playerState = await this.stateManager.getPlayerState(actor),
            gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates()
        switch (type) {
            case MoveType.getPosition: {
                const prevPlayer = Object.values(playerStates).find(ps => ps.day === playerState.day-1);
                if(!prevPlayer) {
                    playerState.playerStatus = PlayerStatus.prepared;
                }
                else if(prevPlayer.playerStatus === PlayerStatus.shouted) {
                    playerState.playerStatus = PlayerStatus.prepared;
                    const possibilities = [prevPlayer.prey===Prey.Deer?Prey.Rabbit:Prey.Deer, prevPlayer.prey, prevPlayer.prey, prevPlayer.prey, prevPlayer.prey];
                    playerState.mistPrey = possibilities[this.genRandomInt(0, possibilities.length-1)]; //20%看到错误的提示
                }
                break
            }
            case MoveType.shout: {
                if(![Prey.Deer, Prey.Rabbit].includes(params.prey)) {
                    return
                }
                playerState.prey = params.prey;
                playerState.playerStatus = PlayerStatus.shouted;
                if(playerState.hasPen) {
                    const playerRecord = gameState.calendar.find(c => c.day === playerState.day);
                    playerRecord.prey = playerState.prey;
                }
                processPrevAndSelfProfit();
                break
            }
        }

        function processPrevAndSelfProfit() {
            const prevPlayer = Object.values(playerStates).find(ps => ps.day === playerState.day-1);
            if(prevPlayer) {
                prevPlayer.nextPrey = playerState.prey;
                playerState.prevPrey = prevPlayer.prey;
                if(prevPlayer.prey === Prey.Deer) {
                    const meat = playerState.prey === Prey.Deer ? x : z;
                    prevPlayer.profit = prevPlayer.profit + price2 * meat;
                    prevPlayer.playerStatus = PlayerStatus.completed;
                }
            }
            if(playerState.prey === Prey.Rabbit) {
                playerState.profit = (price1 + price2) * y;
                playerState.playerStatus = PlayerStatus.completed;
            } 
            else if(prevPlayer) {
                const meat = prevPlayer.prey === Prey.Deer ? x : z;
                playerState.profit = price1 * meat;
            }
            else {
                playerState.profit = 0;
            }
        }
    }

    genRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}
