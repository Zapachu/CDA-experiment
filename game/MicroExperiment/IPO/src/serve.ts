import {resolve} from 'path'
import {gameId2PlayUrl, RedisCall, Server} from '@bespoke/server'
import Controller from './Controller'
import {ICreateParams, namespace} from './config'
import Robot from './Robot'
import {NspCreateParams, Phase, phaseToNamespace} from '@bespoke-game/stock-trading-config'
import {Trial} from '@elf/protocol'
import {RobotServer} from '@bespoke/robot'

Server.start(namespace, Controller, resolve(__dirname, '../dist'))

RobotServer.start(namespace, Robot)

RedisCall.handle<Trial.Create.IReq<NspCreateParams.IPO>, Trial.Create.IRes>(Trial.Create.name(phaseToNamespace(Phase.IPO)), async params => {
    const gameId = await Server.newGame<ICreateParams>({
        title: `${params.type}:${new Date().toUTCString()}`,
        params
    })
    return {playUrl: gameId2PlayUrl(gameId)}
})