import {TGameState, TPlayerState, IActor, baseEnum} from 'bespoke-core-share'
import {StateSynchronizer, GameStateSynchronizer, PlayerStateSynchronizer} from './StateSynchronizer'
import {BaseLogic} from './BaseLogic'
import {GameDAO} from './GameDAO'

export class StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    private gameStateManager: GameStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>
    private playerStateManagers: Array<PlayerStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>> = []
    private stateSynchronizer: StateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>

    constructor(strategy: baseEnum.SyncStrategy, private logic: BaseLogic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
        this.stateSynchronizer = new StateSynchronizer(strategy, logic)
        this.gameStateManager = this.stateSynchronizer.getGameStateSynchronizer()
    }

    async getGameState(): Promise<TGameState<IGameState>> {
        return await this.gameStateManager.getState(false)
    }

    private getPlayerManager(actor: IActor): PlayerStateSynchronizer<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
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
        const tokens = await GameDAO.getPlayerTokens(this.logic.game.id)
        tokens.forEach(async token=>await this.getPlayerManager({token, type:baseEnum.Actor.player}))
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
