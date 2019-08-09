import {resolve} from 'path'
import {Server, RedisCall, gameId2PlayUrl} from '@bespoke/server'
import Controller from './Controller'
import {namespace, IPOType} from './config'
import {ICreateParams} from './interface'
import Robot from './Robot'
import {Phase, phaseToNamespace} from '@bespoke-game/stock-trading-config'
import {Trial} from '@elf/protocol'
import {RobotServer} from '@bespoke/robot'

Server.start(namespace, Controller, resolve(__dirname, '../dist'))

RobotServer.start(namespace, Robot)

RedisCall.handle<Trial.Create.IReq, Trial.Create.IRes>(Trial.Create.name(phaseToNamespace(Phase.IPO_TopK)), async () => {
    const gameId = await Server.newGame<ICreateParams>({
        title: `${Phase.IPO_TopK}:${new Date().toUTCString()}`,
        params: {
            groupSize: 6,
            total: 10000,
            type: IPOType.TopK
        }
    })
    return {playUrl:gameId2PlayUrl(gameId)}
})
RedisCall.handle<Trial.Create.IReq, Trial.Create.IRes>(Trial.Create.name(phaseToNamespace(Phase.IPO_Median)), async () => {
    const gameId = await Server.newGame<ICreateParams>({
        title: `${Phase.IPO_Median}:${new Date().toUTCString()}`,
        params: {
            groupSize: 6,
            total: 10000,
            type: IPOType.Median
        }
    })
    return {playUrl:gameId2PlayUrl(gameId)}
})
RedisCall.handle<Trial.Create.IReq, Trial.Create.IRes>(Trial.Create.name(phaseToNamespace(Phase.IPO_Median)), async () => {
    const gameId = await Server.newGame<ICreateParams>({
        title: `${Phase.IPO_FPSBA}:${new Date().toUTCString()}`,
        params: {
            groupSize: 6,
            total: 10000,
            type: IPOType.FPSBA
        }
    })
    return {playUrl:gameId2PlayUrl(gameId)}
})