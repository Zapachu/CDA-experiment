import {IActor, StateManager as BespokeStateManager} from '@bespoke/server';
import {Wrapper} from '@extend/share';

export class StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    constructor(private groupIndex: number, private stateManager: BespokeStateManager<ICreateParams, Wrapper.IGameState<IGameState>, Wrapper.TPlayerState<IPlayerState>, MoveType, PushType, IMoveParams, IPushParams>) {

    }

    async getPlayerState(actor: IActor): Promise<Wrapper.TPlayerState<IPlayerState>> {
        return await this.stateManager.getPlayerState(actor);
    }

    async getGameState(): Promise<IGameState> {
        const {groups} = await this.stateManager.getGameState();
        return groups[this.groupIndex].state;
    }

    async getPlayerStates(): Promise<{ [token: string]: Wrapper.TPlayerState<IPlayerState> }> {
        const playerStates = {};
        Object.values(await this.stateManager.getPlayerStates()).forEach(playerState =>
            playerState.groupIndex === this.groupIndex ? playerStates[playerState.actor.token] = playerState : null
        );
        return playerStates;
    }

    async syncState() {
        await this.stateManager.syncState();
    }
}