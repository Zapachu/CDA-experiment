import {resolve} from 'path'
import {ICreateParams, namespace} from './config'
import {gameId2PlayUrl, RedisCall, Server} from '@bespoke/server'
import Controller from './Controller'
import Robot from './Robot'
import {Phase, phaseToNamespace, NspCreateParams} from '@bespoke-game/stock-trading-config'
import {Trial} from '@elf/protocol'
import {RobotServer} from '@bespoke/robot'

Server.start(namespace, Controller, resolve(__dirname, '../dist'))

RobotServer.start(namespace, Robot)

RedisCall.handle<Trial.Create.IReq<NspCreateParams.CBM>, Trial.Create.IRes>(Trial.Create.name(phaseToNamespace(Phase.CBM)), async params => {
    const gameId = await Server.newGame<ICreateParams>({
        title: `${Phase.CBM}:${new Date().toUTCString()}`,
        params
    })
    return {playUrl:gameId2PlayUrl(gameId)}
})