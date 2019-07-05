import {resolve} from 'path'
import {Server, RedisCall, gameId2PlayUrl} from '@bespoke/server'
import Controller from './Controller'
import {namespace, IPOType} from './config'
import {ICreateParams} from './interface'
import Robot from './Robot'
import {Phase, phaseToNamespace} from '@bespoke-game/stock-trading-config'
import {CreateGame} from '@elf/protocol'
import {RobotServer} from '@bespoke/robot'

Server.start(namespace, Controller, resolve(__dirname, '../dist'))

RobotServer.start(namespace, Robot)

RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(CreateGame.name(phaseToNamespace(Phase.IPO_TopK)), async ({keys}) => {
    const gameId = await Server.newGame<ICreateParams>({
        title: `${Phase.IPO_TopK}:${new Date().toUTCString()}`,
        desc: '',
        params: {
            groupSize: 6,
            total: 10000,
            type: IPOType.TopK
        }
    })
    return {playUrls: keys.map(key => gameId2PlayUrl(gameId, key))}
})
RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(CreateGame.name(phaseToNamespace(Phase.IPO_Median)), async ({keys}) => {
    const gameId = await Server.newGame<ICreateParams>({
        title: `${Phase.IPO_Median}:${new Date().toUTCString()}`,
        desc: '',
        params: {
            groupSize: 6,
            total: 10000,
            type: IPOType.Median
        }
    })
    return {playUrls: keys.map(key => gameId2PlayUrl(gameId, key))}
})