/**
 * 实验命名空间，全局唯一，被用于前后端路由、redisKey等的前缀
 */
export const namespace = 'Showcase'

/**
 * 前端(玩家、主持人)动作类型
 */
export enum MoveType {
}

/**
 * 后端推送类型， 仅用于推送倒计时、通知等非重要消息， 前端重连时历史消息将丢失
 */
export enum PushType {
}

export interface IMoveParams {
}

export interface IPushParams {
}

export interface ICreateParams {
}

/**
 * 实验状态，所有玩家可见(可通过Controller.filterGameState过滤不可见字段)， 前端重连时重新获取最新状态
 */
export interface IGameState {
}

/**
 * 玩家状态，仅自己可见。与gameState分开独立同步，前端接收的状态中playerState版本有可能落后于gameState，
 * 故状态设计时应尽量避免从gameState指向playerState的指针
 */
export interface IPlayerState {
}

/**
 *  可选接口声明，机器人的启动参数
 */
export interface IRobotMeta {

}