import {BaseLogic, IActor, IMoveCallback, Log, TGameState, TPlayerState} from '@bespoke/server'
import {
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    IRobotMeta,
    MoveType,
    PushType
} from './config'

/**
 *  Logic
 *  I. gameState、playerState均为指针引用，故可在任何时候直接赋值 gameState.filed = value 修改实验状态，
 *     再显式调用 this.stateManager.syncState() 将状态同步至前端
 */
export class Logic extends BaseLogic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta> {

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        return gameState
    }

    /**
     *  玩家首次访问play页面时调用
     * @param actor : {token: 玩家唯一标识， type: 玩家类型}
     */
    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = super.initPlayerState(actor)
        const gameState = await this.stateManager.getGameState()//若gameState还未初始化，则会先调用initGameState()后再返回
        Log.d(gameState)
        return playerState
    }

    /**
     *  玩家操作逻辑处理， 修改state， 函数执行完毕后会自动同步状态至前端
     */
    protected async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor),
            playerStates = await this.stateManager.getPlayerStates()
        switch (type) {
        }
    }

    /**
     * 主持人在控制台的动作处理
     */
    protected async teacherMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        return undefined
    }
}