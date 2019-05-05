/**
 * 设置匹配时间
 *      如果未匹配到，则激活机器人进入，与玩家进行交互
 *      如果在规定时间内匹配到玩家，则玩家间相互交互
 * */

import {BaseRobot} from 'bespoke-server'
import {MoveType, PushType} from './config'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'

export default class extends BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    async init () {
        this.frameEmitter.emit(MoveType.prepare)
        this.frameEmitter.on(PushType.startBid, () => {

        })
        return this
    }


}

