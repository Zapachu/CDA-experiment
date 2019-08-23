import {resolve} from 'path'
import {gameId2PlayUrl, RedisCall, Server} from '@bespoke/server'
import {RobotServer} from '@bespoke/robot'
import Controller from './Controller'
import Robot from './Robot'
import {DEFAULT_PARAMS, ICreateParams, namespace} from './config'
import {Phase, phaseToNamespace} from '@bespoke-game/stock-trading-config'
import {Trial} from '@elf/protocol'

Server.start(namespace, Controller, resolve(__dirname, '../dist'))

RobotServer.start(namespace, Robot)

RedisCall.handle<Trial.Create.IReq, Trial.Create.IRes>(
    Trial.Create.name(phaseToNamespace(Phase.TBM)),
    async () => {
      const gameId = await Server.newGame<ICreateParams>({
        title: `${Phase.TBM}:${new Date().toUTCString()}`,
        params: DEFAULT_PARAMS
      })
      return {playUrl: gameId2PlayUrl(gameId)}
    }
)
