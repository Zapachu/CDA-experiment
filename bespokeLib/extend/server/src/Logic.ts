import {BaseLogic, IActor, IMoveCallback, TGameState} from '@bespoke/server'
import {Extend} from '@extend/share'
import {Group} from './group'

export class Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>
    extends BaseLogic<Extend.ICreateParams<ICreateParams>, Extend.IGameState<IGameState>, Extend.IPlayerState<IPlayerState>, Extend.MoveType | MoveType, PushType, IMoveParams, IPushParams> {

    GroupLogic: new(params: ICreateParams, stateManager: Group.StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) => Group.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>

    groupsLogic: Group.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>[] = []

    initGameState(): TGameState<Extend.IGameState<IGameState>> {
        const gameState = super.initGameState()
        gameState.groups = []
        return gameState
    }

    protected async playerMoveReducer(actor: IActor, type: Extend.MoveType | MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {group, groupSize} = this.game.params
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor),
            playerStates = await this.stateManager.getPlayerStates()
        // noinspection JSRedundantSwitchStatement
        switch (type) {
            case Extend.MoveType.getGroup:
                let groupIndex = gameState.groups.findIndex(group => group.playerNum < groupSize)
                if (groupIndex === -1) {
                    if (gameState.groups.length === group) {
                        break
                    }
                    groupIndex = this.groupsLogic.length
                    const groupLogic = new this.GroupLogic(this.game.params.groupsParams[groupIndex], new Group.StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>(groupIndex, this.stateManager))
                    this.groupsLogic.push(groupLogic)
                    gameState.groups.push({
                        playerNum: 0,
                        state: groupLogic.initGameState()
                    })
                }
                playerState.groupIndex = groupIndex
                playerState.state = await this.groupsLogic[groupIndex].initPlayerState()
                gameState.groups[groupIndex].playerNum++
                break
            default:
                await this.groupsLogic[playerState.groupIndex].playerMoveReducer(actor, type, params, cb)
        }
    }
}