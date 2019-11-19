import { Response, Router } from 'express'
import { resolve } from 'path'
import { gameId2PlayUrl, Model, RedisCall, Server } from '@bespoke/server'
import Controller from './Controller'
import Robot from './Robot'
import { ICreateParams, namespace } from './config'
import { Trial } from '@elf/protocol'
import { elfSetting } from '@elf/setting'
import { RobotServer } from '@bespoke/robot'
// import { config } from "@bespoke/share";

const { FreeStyleModel } = Model
const ROOTNAME = 'gametrial'

const router = Router().get('/share/:gameId', async (req: any, res: Response) => {
  const {
    user,
    params: { gameId },
    query: { userId }
  } = req
  if (userId || user) {
    const key = userId ? userId : user._id.toString()
    const result = await FreeStyleModel.findOne({
      game: gameId,
      key
    })
      .lean()
      .exec()
    if (result) {
      const originalUrl = req.originalUrl.includes('?') ? req.originalUrl.split('?')[0] : req.originalUrl
      const url = originalUrl.replace('/share', '/play')
      return res.redirect(url)
    }
  }
  return res.redirect(`${elfSetting.proxyOrigin}/${ROOTNAME}/game/${namespace}`)
})

Server.start(namespace, Controller, resolve(__dirname, '../dist'), router)

RobotServer.start(namespace, Robot)

RedisCall.handle<Trial.Create.IReq, Trial.Create.IRes>(Trial.Create.name(namespace), async () => {
  const gameId = await Server.newGame<ICreateParams>({
    title: `${namespace}:${new Date().toUTCString()}`,
    params: {
      groupSize: 10
    }
  })
  return { playUrl: gameId2PlayUrl(gameId) }
})
