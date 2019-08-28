import * as Extend from '@extend/server'
import {IActor, IMoveCallback} from '@bespoke/share'
import {Wrapper} from '@extend/share'
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
} from './config'
import {Log} from '@elf/util'
import shuffle = require('lodash/shuffle')

class GroupLogic extends Extend.Group.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    initGameState(): IGameState {
        const gameState = super.initGameState()
        gameState.rounds = []
        return gameState
    }

    async initPlayerState(index: number): Promise<Wrapper.TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(index)
        playerState.index = index
        playerState.status = PlayerStatus.guide
        playerState.rounds = []
        return playerState
    }

    async startRound(r: number) {
        const {round, oldPlayer, newPlayer, minPrivateValue, maxPrivateValue} = this.params
        if (r >= round) {
            return
        }
        const gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates()
        gameState.round = r
        gameState.rounds[r] = {
            timeLeft: CONFIG.tradeSeconds,
            oldFlag: shuffle([...Array(oldPlayer).fill(true), ...Array(newPlayer).fill(false)]),
            result: []
        }
        Object.values(playerStates).forEach(p => p.rounds[r] = {
            status: PlayerRoundStatus.prepare,
            sort: [],
            privatePrices: Array(newPlayer + oldPlayer).fill(null)
                .map(() => ~~(minPrivateValue + Math.random() * (maxPrivateValue - minPrivateValue)))
        })
        await this.stateManager.syncState()
        const tradeTimer = global.setInterval(() => {
            if(gameState.rounds[r].result.length){

            }
        }, 1e3)
    }

    async getPlayerRoundStates(): Promise<Array<IPlayerRoundState>> {
        const gameState = await this.stateManager.getGameState(),
            {round} = gameState,
            playerStates = await this.stateManager.getPlayerStates(),
            playerStatesArr = Object.values(playerStates)
        return playerStatesArr.map(({rounds}) => rounds[round])
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
            playerRoundStates = await this.getPlayerRoundStates()
        return {
            gameState, gameRoundState, playerStatesArr, playerRoundStates
        }
    }

    async roundOver() {
        const {gameState: {round}, gameRoundState, playerRoundStates} = await this.getState()
        Log.d(playerRoundStates.map(({sort}) => sort))
        Log.d(gameRoundState.result)
        Log.d('TODO : Round Over')
        if (round <= this.params.round) {
            this.startRound(round + 1)
        } else {
            Log.d('TODO : Game Over')
        }
    }

    async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {gameState, playerStatesArr, playerRoundStates} = await this.getState(),
            playerState = await this.stateManager.getPlayerState(actor),
            {round} = gameState,
            playerRoundState = playerState.rounds[round]
        switch (type) {
            case MoveType.guideDone: {
                playerState.status = PlayerStatus.round
                if (playerStatesArr.every(p => p.status === PlayerStatus.round)) {
                    this.startRound(0)
                }
                break
            }
            case MoveType.submit:
                playerRoundState.status = PlayerRoundStatus.wait
                playerRoundState.sort = params.sort
                if (playerRoundStates.every(p => p.status === PlayerRoundStatus.wait)) {
                    this.roundOver()
                }
        }

    }
}

export class Logic extends Extend.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    GroupLogic = GroupLogic
}