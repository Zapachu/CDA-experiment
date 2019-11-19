import { resolve } from 'path'
import { ICreateParams, namespace } from './config'
import { gameId2PlayUrl, Server } from '@bespoke/server'
import { RobotServer } from '@bespoke/robot'
import { Controller } from './Controller'
import { Robot } from './Robot'
import { RedisCall, Trial } from '@elf/protocol'
import { NCreateParams, Phase } from '@micro-experiment/share'

Server.start(namespace, Controller, resolve(__dirname, '../dist'))
RobotServer.start(namespace, Robot)

RedisCall.handle<Trial.Create.IReq<NCreateParams.OpenAuction>, Trial.Create.IRes>(
  Trial.Create.name(Phase.OpenAuction),
  async params => {
    const gameId = await Server.newGame<ICreateParams>({
      title: `${Phase.OpenAuction}:${new Date().toUTCString()}`,
      params
    })
    return { playUrl: gameId2PlayUrl(gameId) }
  }
)
