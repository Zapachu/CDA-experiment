import Queue, {QueueWorker} from 'queue'
import cloneDeep = require('lodash/cloneDeep')
import isEqual = require('lodash/isEqual')
import {diff} from 'deep-diff'
import {EventIO} from '../util'
import {baseEnum, TGameState, TPlayerState, IGameWithId, IMoveLog, IActor} from '@common'
import GameDAO from './GameDAO'
import {BaseController} from '../'
import {MoveLogModel} from '../model'

class GameStateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    private _state: TGameState<IGameState>
    private stateSnapshot: TGameState<IGameState>

    constructor(private controller: BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>) {
    }

    async getState(forClient: boolean): Promise<TGameState<IGameState>> {
        if (!this._state) {
            this._state = await GameDAO.queryGameState<IGameState>(this.controller.game.id) || this.controller.initGameState()
        }
        if (forClient) {
            //TODO filterState
            return this._state
        } else {
            return this._state
        }
    }

    async syncState(wholeState: boolean = false) {
        const state = await this.getState(true)
        if (wholeState) {
            EventIO.emitEvent(this.controller.game.id, baseEnum.SocketEvent.syncGameState, cloneDeep(state))
        } else {
            if (isEqual(state, this.stateSnapshot)) {
                return
            }
            EventIO.emitEvent(this.controller.game.id, baseEnum.SocketEvent.changeGameState, diff(this.stateSnapshot || {}, state))
        }
        this.stateSnapshot = cloneDeep(state)
        GameDAO.saveGameState(this.controller.game.id, state)
    }
}

class PlayerStateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    private _state: TPlayerState<IPlayerState>
    private stateSnapshot: TPlayerState<IPlayerState>

    constructor(public actor: IActor, private controller: BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>) {
    }

    async getState(): Promise<TPlayerState<IPlayerState>> {
        if (!this._state) {
            this._state = await GameDAO.queryPlayerState<IPlayerState>(this.controller.game.id, this.actor.token) ||
                await this.controller.initPlayerState(this.actor)
        }
        return this._state
    }

    async syncState(wholeState: boolean = false) {
        const gameState = await this.controller.stateManager.getGameState()
        const state = await this.getState()
        if (wholeState) {
            const stateCopy = cloneDeep(state)
            EventIO.emitEvent(state.connectionId, baseEnum.SocketEvent.syncPlayerState, stateCopy)
            EventIO.emitEvent(gameState.connectionId, baseEnum.SocketEvent.syncPlayerState, stateCopy, this.actor.token)
        } else {
            if (isEqual(state, this.stateSnapshot)) {
                return
            }
            const stateChanges = diff(this.stateSnapshot || {}, state)
            EventIO.emitEvent(state.connectionId, baseEnum.SocketEvent.changePlayerState, stateChanges)
            EventIO.emitEvent(gameState.connectionId, baseEnum.SocketEvent.changePlayerState, stateChanges, this.actor.token)
        }
        this.stateSnapshot = cloneDeep(state)
        GameDAO.savePlayerState(this.controller.game.id, this.actor.token, state)
    }
}

export class StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    private gameStateManager: GameStateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>
    private playerStateManagers: Array<PlayerStateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>> = []

    constructor(private controller: BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>) {
        this.gameStateManager = new GameStateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>(this.controller)
    }

    async getGameState(): Promise<TGameState<IGameState>> {
        return await this.gameStateManager.getState(false)
    }

    private getPlayerManager(actor: IActor): PlayerStateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
        let playerStateManager = this.playerStateManagers.find(manager => manager.actor.token === actor.token)
        if (!playerStateManager) {
            playerStateManager = new PlayerStateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>(actor, this.controller)
            this.playerStateManagers.push(playerStateManager)
        }
        return playerStateManager
    }

    async getPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        return await this.getPlayerManager(actor).getState()
    }

    async getPlayerStates(): Promise<{ [token: string]: TPlayerState<IPlayerState> }> {
        const playerStates = {}
        for (let manager of this.playerStateManagers) {
            const playerState = await manager.getState()
            playerStates[playerState.actor.token] = playerState
        }
        return playerStates
    }

    async syncState(wholeState: boolean = false) {
        await this.gameStateManager.syncState(wholeState)
        this.playerStateManagers.forEach(async manager => manager.syncState(wholeState))
    }

    async syncWholeState2Player(actor: IActor): Promise<void> {
        await this.gameStateManager.syncState(true)
        await this.getPlayerManager(actor).syncState(true)
    }
}

export class MoveQueue<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    private seq = 0
    private gameState: TGameState<IGameState> = null
    private playerStates: { [token: string]: TPlayerState<IPlayerState> } = null
    private queue = Queue({
        concurrency: 1,
        autostart: true
    } as any)

    constructor(private game: IGameWithId<ICreateParams>, private stateManager: StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>) {
    }

    push(actor: IActor, type: string, params: {}, moveHandler: QueueWorker): void {
        const moveLog: IMoveLog<IGameState, IPlayerState> = {
            seq: this.seq++,
            gameId: this.game.id,
            token: actor.token,
            type,
            params
        }
        this.queue.push(async () => {
            await moveHandler()
            await this.stateManager.syncState()
            const gameState = await this.stateManager.getGameState(),
                playerStates = await this.stateManager.getPlayerStates()
            if (!this.gameState) {
                Object.assign(moveLog, {
                    gameState,
                    playerStates
                })
            } else {
                const gameStateChanges = diff(this.gameState || {}, gameState) || [],
                    playerStatesChanges = diff(this.playerStates || {}, playerStates) || []
                Object.assign(moveLog, {
                    gameStateChanges,
                    playerStatesChanges
                })
            }
            this.gameState = cloneDeep(gameState)
            this.playerStates = cloneDeep(playerStates)
            await MoveLogModel.create(moveLog)
        })
    }
}