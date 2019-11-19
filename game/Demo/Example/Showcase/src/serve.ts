import { resolve } from 'path'
import { Request, Response, Router } from 'express'
import { ResponseCode, Server } from '@bespoke/server'
import { RobotServer } from '@bespoke/robot'
import { namespace } from './config'
import { Logic } from './Logic'
import { Robot } from './Robot'

/**
 *  自定义后端路由，用于处理xlsx导出、自定义页面渲染等
 */
const router = Router().get('hello', async (req: Request, res: Response) => {
  res.json({
    code: ResponseCode.success
  })
})

Server.start(namespace, Logic, resolve(__dirname, '../dist'), router)
RobotServer.start(namespace, Robot)
