import {TGameState, TPlayerState, IActor, baseEnum} from 'bespoke-common'
import {StateSynchronizer, GameStateSynchronizer, PlayerStateSynchronizer} from './StateSynchronizer'
import {BaseController} from './GameLogic'

export class StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    private gameStateManager: GameStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>
    private playerStateManagers: Array<PlayerStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>> = []
    private stateSynchronizer: StateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>

    constructor(strategy: baseEnum.SyncStrategy, controller: BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>) {
        this.stateSynchronizer = new StateSynchronizer(strategy, controller)
        this.gameStateManager = this.stateSynchronizer.getGameStateSynchronizer()
    }

    async getGameState(): Promise<TGameState<IGameState>> {
        return await this.gameStateManager.getState(false)
    }

    private getPlayerManager(actor: IActor): PlayerStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
        let playerStateManager = this.playerStateManagers.find(manager => manager.actor.token === actor.token)
        if (!playerStateManager) {
            playerStateManager = this.stateSynchronizer.getPlayerStateSynchronizer(actor)
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
