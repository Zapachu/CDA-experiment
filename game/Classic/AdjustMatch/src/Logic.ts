import * as Extend from '@extend/server'
import {IActor, IMoveCallback} from '@bespoke/share'
import {Wrapper} from '@extend/share'
import {
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
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
            oldFlag: shuffle([...Array(oldPlayer).fill(true), ...Array(newPlayer).fill(false)]),
            result: []
        }
        Object.values(playerStates).forEach(p => p.rounds[r] = {
            privatePrices: Array(newPlayer + oldPlayer).fill(null)
                .map(() => ~~(minPrivateValue + Math.random() * (maxPrivateValue - minPrivateValue)))
        })
        await this.stateManager.syncState()
    }

    async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {oldPlayer, newPlayer, minPrivateValue, maxPrivateValue} = this.params
        const gameState = await this.stateManager.getGameState(),
            {round} = gameState,
            playerState = await this.stateManager.getPlayerState(actor),
            playerStates = await this.stateManager.getPlayerStates(),
            playerStatesArr = Object.values(playerStates),
            playerRoundState = playerState.rounds[round],
            playerRoundStates = playerStatesArr.map(({rounds}) => rounds[round])
        switch (type) {
            case MoveType.guideDone: {
                playerState.status = PlayerStatus.round
                if (playerStatesArr.every(p => p.status === PlayerStatus.round)) {
                    this.startRound(0)
                }
                break
            }
            case MoveType.submit:
                const {sort} = params
                Log.d(sort)
        }
    }
}

export class Logic extends Extend.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    GroupLogic = GroupLogic
}