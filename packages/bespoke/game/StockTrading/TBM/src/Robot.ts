/**
 * 设置匹配时间
 *      如果未匹配到，则激活机器人进入，与玩家进行交互
 *      如果在规定时间内匹配到玩家，则玩家间相互交互
 * */

import {BaseRobot} from 'bespoke-server'
import {MoveType, PushType} from './config'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'

export default class extends BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    async init() {
        // online and getPosition

        setTimeout(() => this.frameEmitter.emit(MoveType.joinRobot), 2000)
        setTimeout(() => this.frameEmitter.emit(MoveType.prepare), 4000)

        // shout stage
        this.frameEmitter.on(PushType.robotShout, () => {
            const privatePrice = this.playerState.multi.privateValue
            const role = this.playerState.role
            const price = this.genPrice(role, privatePrice)
            this.frameEmitter.emit(MoveType.shout, {price})
        })

        // round switch
        // this.frameEmitter.on(PushType.nextRound, async () => {
        //     await this.frameEmitter.emit(MoveType.prepare)
        // })
        return this
    }

    genPrice(role, privatePrice) {
        const genRan = (min, max) => {
            return parseInt((Math.random() * (max - min)).toFixed(1))
        }
        switch (role) {
            case 0:
                return genRan(0, privatePrice)
            case 1:
                return genRan(privatePrice, privatePrice + 20)
            default:
                return privatePrice
        }
    }


}

