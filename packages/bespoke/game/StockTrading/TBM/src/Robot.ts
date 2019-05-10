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

        setTimeout.bind(this, this.frameEmitter.emit(MoveType.getPosition), 1000)

        // for core's interception
        setTimeout.bind(this, this.frameEmitter.emit(MoveType.prepare), 2000)

        // shout stage
        this.frameEmitter.on(PushType.startBid, ({roundIndex}) => {
            console.log('startBid', roundIndex)
            const privatePrice = this.playerState.privatePrices[roundIndex]
            const role = this.playerState.role
            const price = this.genPrice(role, privatePrice)
            this.frameEmitter.emit(MoveType.shout, {price})
        })

        // round switch
        this.frameEmitter.on(PushType.nextRound, async () => {
            await this.frameEmitter.emit(MoveType.prepare)
        })
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

