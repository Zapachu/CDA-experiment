import {BaseLogic, IActor, IMoveCallback, TGameState} from '@bespoke/server'
import {Wrapper} from '@extend/share'
import * as Group from './group'

export class Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>
    extends BaseLogic<Wrapper.ICreateParams<ICreateParams>, Wrapper.IGameState<IGameState>, Wrapper.IPlayerState<IPlayerState>, Wrapper.MoveType<MoveType>, PushType, Wrapper.IMoveParams<IMoveParams>, IPushParams> {

    GroupLogic: new(params: ICreateParams, stateManager: Group.StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) => Group.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>

    groupsLogic: Group.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>[]

    async init(): Promise<this> {
        await super.init()
        const {game: {params: {group, groupsParams}}} = this
        this.groupsLogic = Array(group).fill(null).map((_, i) =>
            new this.GroupLogic(groupsParams[i], new Group.StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>(i, this.stateManager))
        )
        return this
    }

    initGameState(): TGameState<Wrapper.IGameState<IGameState>> {
        const gameState = super.initGameState()
        gameState.groups = Array(this.game.params.group).fill(null).map((_, i) => ({
            playerNum: 0,
            state: this.groupsLogic[i].initGameState()
        }))
        return gameState
    }

    protected async teacherMoveReducer(actor: IActor, type: Wrapper.MoveType<MoveType>, params: Wrapper.IMoveParams<IMoveParams>, cb: IMoveCallback): Promise<void> {
        await this.groupsLogic[params.groupIndex].teacherMoveReducer(actor, type as MoveType, params.params, cb)
        this.startRobot(Math.random())
    }

    protected async playerMoveReducer(actor: IActor, type: Wrapper.MoveType<MoveType>, params: Wrapper.IMoveParams<IMoveParams>, cb: IMoveCallback): Promise<void> {
        const {groupSize} = this.game.params
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor)
        if (type === Wrapper.GroupMoveType.getGroup) {
            if (playerState.groupIndex !== undefined) {
                return
            }
            let groupIndex = gameState.groups.findIndex(group => group.playerNum < groupSize)
            if (groupIndex === -1) {
                return
            }
            playerState.groupIndex = groupIndex
            playerState.state = await this.groupsLogic[groupIndex].initPlayerState()
            gameState.groups[groupIndex].playerNum++
            await this.stateManager.syncState()
        } else {
            await this.groupsLogic[params.groupIndex].playerMoveReducer(actor, type, params.params, cb)
        }
    }
}