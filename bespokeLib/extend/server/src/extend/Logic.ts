import {BaseLogic, IActor, IMoveCallback, TGameState} from '@bespoke/server'
import {Log} from '@elf/util'
import {ICreateParams, IGameState, IPlayerState, MoveType} from '@extend/share'


export class Logic<IGroupParams, IGameGroupState, IPlayerGroupState, GroupMoveType, PushType, IMoveParams, IPushParams>
    extends BaseLogic<ICreateParams<IGroupParams>, IGameState<IGameGroupState>, IPlayerState<IPlayerGroupState>, GroupMoveType | MoveType, PushType, IMoveParams, IPushParams> {

    GroupLogic: new(...args) => GroupLogic<IGroupParams, IGameGroupState, IPlayerGroupState, GroupMoveType, PushType, IMoveParams, IPushParams>

    groupsLogic: GroupLogic<IGroupParams, IGameGroupState, IPlayerGroupState, GroupMoveType, PushType, IMoveParams, IPushParams>[] = []

    initGameState(): TGameState<IGameState<IGameGroupState>> {
        const gameState = super.initGameState()
        gameState.groups = []
        return gameState
    }

    protected async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {group, groupSize} = this.game.params
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor),
            playerStates = await this.stateManager.getPlayerStates()
        // noinspection JSRedundantSwitchStatement
        switch (type) {
            case MoveType.getGroup:
                let groupIndex = gameState.groups.findIndex(group => group.playerNum < groupSize)
                if (groupIndex === -1) {
                    if (gameState.groups.length === group) {
                        break
                    }
                    const groupLogic = new this.GroupLogic()
                    groupIndex = this.groupsLogic.push(groupLogic) - 1
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
                Log.d(type, params)
        }
    }
}

export class GroupLogic<IGroupParams, IGameGroupState, IPlayerGroupState, GroupMoveType, PushType, IMoveParams, IPushParams> {
    initGameState(): IGameGroupState {
        return {} as any
    }

    async initPlayerState(): Promise<IPlayerGroupState> {
        return {} as any
    }
}