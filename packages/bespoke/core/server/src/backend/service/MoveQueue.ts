import Queue, {QueueWorker} from 'queue'
import cloneDeep = require('lodash/cloneDeep')
import {diff} from 'deep-diff'
import {TGameState, TPlayerState, IGameWithId, IMoveLog, IActor} from 'bespoke-common'
import {MoveLogModel} from '../model'
import {StateManager} from './StateManager'

export class MoveQueue<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    private seq = 0
    private gameState: TGameState<IGameState> = null
    private playerStates: { [token: string]: TPlayerState<IPlayerState> } = null
    private queue = Queue({
        concurrency: 1,
        autostart: true
    } as any)

    constructor(private game: IGameWithId<ICreateParams>, private stateManager: StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
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
