import { resolve } from 'path'
import nodeXlsx from 'node-xlsx'
import { FetchRoute, namespace } from './config'
import { BaseLogic, Model, Server } from '@bespoke/server'
import { Router } from 'express'
import { Logic } from './Logic'

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
  data.push(['玩家', '学号', '编号', '题目数量', '偏好选择', '结果题号', '是否选中', '受益'])
  const rounds = (await Model.FreeStyleModel.find({
    game: game.id
  }).sort({ key: 1 })) as Array<any>
  rounds.forEach(round => {
    const [g, r] = round.key.split('_')
    data.push([])
    data.push([`第${+g + 1}组`, `第${+r + 1}轮`])
    round.data.forEach(({ userName, stuNum, playerIndex, T, preference, caseIndex, success, award }) =>
      data.push([userName, stuNum, playerIndex, T, preference, caseIndex, success, award])
    )
  })
  const buffer = nodeXlsx.build([{ name, data }], option)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats')
  res.setHeader('Content-Disposition', 'attachment; filename=' + `${encodeURI(name)}.xlsx`)
  return res.end(buffer, 'binary')
})

Server.start(namespace, Logic, resolve(__dirname, '../dist'), router)
