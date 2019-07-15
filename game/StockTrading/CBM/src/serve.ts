import {resolve} from 'path'
import {ICreateParams, namespace} from './config'
import {gameId2PlayUrl, RedisCall, Server} from '@bespoke/server'
import Controller from './Controller'
import Robot from './Robot'
import {Phase, phaseToNamespace} from '@bespoke-game/stock-trading-config'
import {CreateGame} from '@elf/protocol'
import {RobotServer} from '@bespoke/robot'

Server.start(namespace, Controller, resolve(__dirname, '../static'))

RobotServer.start(namespace, Robot)

RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(CreateGame.name(phaseToNamespace(Phase.CBM)), async ({keys}) => {
    const gameId = await Server.newGame<ICreateParams>({
        title: `${Phase.CBM}:${new Date().toUTCString()}`,
        params: {
            allowLeverage: false
        }
    })
    return {playUrls: keys.map(key => gameId2PlayUrl(gameId, key))}
})
RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(CreateGame.name(phaseToNamespace(Phase.CBM_Leverage)), async ({keys}) => {
    const gameId = await Server.newGame<ICreateParams>({
        title: `${Phase.CBM}:${new Date().toUTCString()}`,
        params: {
            allowLeverage: true
        }
    })
    return {playUrls: keys.map(key => gameId2PlayUrl(gameId, key))}
})