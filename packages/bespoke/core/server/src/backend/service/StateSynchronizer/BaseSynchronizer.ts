import {baseEnum, IActor, TGameState, TPlayerState} from 'bespoke-common'
import GameDAO from '../GameDAO'
import {BaseController} from '../GameLogic'
import {EventIO} from '../../util'
import isEqual = require('lodash/isEqual')
import cloneDeep = require('lodash/cloneDeep')

export class GameStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    private _state: TGameState<IGameState>
    private _stateSnapshot: TGameState<IGameState>

    constructor(protected controller: BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
    }

    async getState(forClient: boolean): Promise<TGameState<IGameState>> {
        if (!this._state) {
            this._state = await GameDAO.queryGameState<IGameState>(this.controller.game.id) || this.controller.initGameState()
        }
        if (forClient) {
            return this.controller.filterGameState(this._state)
        } else {
            return this._state
        }
    }

    async syncState(wholeState?: boolean) {
        const state = await this.getState(false)
        if (wholeState) {
            await this.syncClientState(wholeState)
        } else {
            if (isEqual(state, this._stateSnapshot)) {
                return
            }
            await this.syncClientState(wholeState)
        }
        this._stateSnapshot = cloneDeep(state)
        GameDAO.saveGameState(this.controller.game.id, await this.getState(false))
    }

    async syncClientState(wholeState?: boolean) {
        const state = await this.getState(true)
        EventIO.emitEvent(this.controller.game.id, baseEnum.SocketEvent.syncGameState_json, state)
    }
}

export class PlayerStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    private _state: TPlayerState<IPlayerState>
    private _stateSnapshot: TPlayerState<IPlayerState>

    constructor(public actor: IActor, protected controller: BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
    }

    async getState(): Promise<TPlayerState<IPlayerState>> {
        if (!this._state) {
            this._state = await GameDAO.queryPlayerState<IPlayerState>(this.controller.game.id, this.actor.token) ||
                await this.controller.initPlayerState(this.actor)
        }
        return this._state
    }

    async syncState(wholeState?: boolean) {
        const state = await this.getState()
        if (wholeState) {
            await this.syncClientState(wholeState)
        } else {
            if (isEqual(state, this._stateSnapshot)) {
                return
            }
            await this.syncClientState(wholeState)
        }
        this._stateSnapshot = cloneDeep(state)
        GameDAO.savePlayerState(this.controller.game.id, this.actor.token, state)
    }

    async syncClientState(wholeState?: boolean) {
        const gameState = await this.controller.stateManager.getGameState()
        const state = await this.getState()
        EventIO.emitEvent(state.connectionId, baseEnum.SocketEvent.syncPlayerState_json, state)
        EventIO.emitEvent(gameState.connectionId, baseEnum.SocketEvent.syncPlayerState_json, state, this.actor.token)
    }
}
