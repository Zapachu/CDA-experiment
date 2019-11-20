import { resolve } from 'path'
import { gameId2PlayUrl, RedisCall, Server } from '@bespoke/server'
import { ICreateParams, namespace } from './config'
import { Trial } from '@elf/protocol'
import { Logic } from './Logic'

Server.start(namespace, Logic, resolve(__dirname, '../dist'))

RedisCall.handle<Trial.Create.IReq, Trial.Create.IRes>(Trial.Create.name(namespace), async () => {
  const gameId = await Server.newGame<ICreateParams>({
    title: `${namespace}:${new Date().toUTCString()}`,
    params: {
      groupSize: 10
    }
  })
  return { playUrl: gameId2PlayUrl(gameId) }
})
