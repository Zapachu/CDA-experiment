import { resolve } from 'path'
import nodeXlsx from 'node-xlsx'
import { FetchRoute, IShout, namespace, Role } from './config'
import { BaseLogic, Model, Server } from '@bespoke/server'
import { Router } from 'express'
import { Logic } from './Logic'

const router = Router().get(FetchRoute.exportXls, async (req, res) => {
  const {
    params: { gameId }
  } = req
  const { game } = await BaseLogic.getLogic(gameId)
  if ((req.user as any).id !== game.owner) {
    return res.end('Invalid Request')
  }
  const name = 'RoundResult'
  const data = [],
    option = {}
  const rounds = (await Model.FreeStyleModel.find({
    game: game.id
  }).sort({ key: 1 })) as Array<any>
  rounds.forEach(round => {
    const [g, r] = round.key.split('_')
    data.push([])
    data.push([`第${+g + 1}组`, `第${+r + 1}轮`])
    data.push(['玩家编号', '角色', '报价', '成交', '成交对象'])
    round.data
      .filter(s => s)
      .forEach((shout: IShout, i) =>
        data.push([
          i + 1,
          shout.role === Role.buyer ? 'Buyer' : 'Seller',
          shout.price,
          !!shout.tradePair,
          shout.tradePair ? shout.tradePair + 1 : ''
        ])
      )
  })
  const buffer = nodeXlsx.build([{ name, data }], option)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats')
  res.setHeader('Content-Disposition', 'attachment; filename=' + `${encodeURI(name)}.xlsx`)
  return res.end(buffer, 'binary')
})

Server.start(namespace, Logic, resolve(__dirname, '../dist'), router)
