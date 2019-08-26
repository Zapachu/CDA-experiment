import {resolve} from 'path'
import {ICreateParams, namespace} from './config'
import {gameId2PlayUrl, RedisCall, Server} from '@bespoke/server'
import Controller from './Controller'
import Robot from './Robot'
import {Phase, phaseToNamespace} from '@bespoke-game/stock-trading-config'
import {Trial} from '@elf/protocol'
import {RobotServer} from '@bespoke/robot'

Server.start(namespace, Controller, resolve(__dirname, '../dist'))

RobotServer.start(namespace, Robot)

RedisCall.handle<Trial.Create.IReq, Trial.Create.IRes>(Trial.Create.name(phaseToNamespace(Phase.CBM)), async () => {
    const gameId = await Server.newGame<ICreateParams>({
        title: `${Phase.CBM}:${new Date().toUTCString()}`,
        params: {
            allowLeverage: false
        }
    })
    return {playUrl:gameId2PlayUrl(gameId)}
})
RedisCall.handle<Trial.Create.IReq, Trial.Create.IRes>(Trial.Create.name(phaseToNamespace(Phase.CBM_Leverage)), async () => {
    const gameId = await Server.newGame<ICreateParams>({
        title: `${Phase.CBM}:${new Date().toUTCString()}`,
        params: {
            allowLeverage: true
        }
    })
    return {playUrl:gameId2PlayUrl(gameId)}
})