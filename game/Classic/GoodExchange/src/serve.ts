import { resolve } from 'path'
import nodeXlsx from 'node-xlsx'
import { FetchRoute, namespace } from './config'
import { BaseLogic, Model, Server } from '@bespoke/server'
import { RobotServer } from '@bespoke/robot'
import { Router } from 'express'
import { Logic } from './Logic'
import { Robot } from './Robot'

const router = Router().get(FetchRoute.exportXls, async (req, res) => {
  const {
    params: { gameId },
    query: { group, round }
  } = req
  const { game } = await BaseLogic.getLogic(gameId)
  if ((req.user as any).id !== game.owner) {
    return res.end('Invalid Request')
  }
  const name = 'RoundResult'
  const data = [],
    option = {}
  data.push(['玩家', '学号', '编号', '初始物品', '初始物品价格', '最终物品编号', '最终物品价格'])
  const rounds = (await Model.FreeStyleModel.find({
    game: game.id
  }).sort({ key: 1 })) as Array<any>
  rounds.forEach(round => {
    const [g, r] = round.key.split('_')
    data.push([])
    data.push([`第${+g + 1}组`, `第${+r + 1}轮`])
    round.data.forEach(({ userName, stuNum, playerIndex, initGood, initGoodPrice, good, goodPrice }) =>
      data.push([userName, stuNum, initGood, playerIndex, initGoodPrice, good, goodPrice])
    )
  })
  const buffer = nodeXlsx.build([{ name, data }], option)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats')
  res.setHeader('Content-Disposition', 'attachment; filename=' + `${encodeURI(name)}.xlsx`)
  return res.end(buffer, 'binary')
})

Server.start(namespace, Logic, resolve(__dirname, '../dist'), router)

RobotServer.start(namespace, Robot)
