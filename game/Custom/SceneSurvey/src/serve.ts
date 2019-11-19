import { Response, Router } from 'express'
import nodeXlsx from 'node-xlsx'
import { resolve } from 'path'
import { BaseLogic, Server } from '@bespoke/server'
import Controller from './Controller'
import { FetchRoute, namespace, SheetType } from './config'

const router = Router()
  .get(FetchRoute.exportXls, async (req: any, res: Response) => {
    const {
      params: { gameId },
      query: { sheetType }
    } = req
    const { game, stateManager } = await BaseLogic.getLogic(gameId)
    if (req.user.id !== game.owner) {
      return res.end('Invalid Request')
    }
    const gameState = await stateManager.getGameState()
    const name = SheetType[sheetType]
    let data = [],
      option = {}
    switch (sheetType) {
      case SheetType.result:
      default: {
        const sheet = gameState['sheets'][sheetType]
        data = sheet.data
        option = sheet.data
      }
    }
    const buffer = nodeXlsx.build([{ name, data }], option)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats')
    res.setHeader('Content-Disposition', 'attachment; filename=' + `${encodeURI(name)}.xlsx`)
    return res.end(buffer, 'binary')
  })
  .get(FetchRoute.exportXlsPlaying, async (req: any, res: Response) => {
    const {
      params: { gameId },
      query: { sheetType }
    } = req
    const controller = (await BaseLogic.getLogic(gameId)) as Controller
    if (req.user.id !== controller.game.owner) {
      return res.end('Invalid Request')
    }
    const name = SheetType[sheetType]
    let data = [],
      option = {}
    switch (sheetType) {
      case SheetType.result:
      default: {
        data = await controller.genExportData()
      }
    }
    const buffer = nodeXlsx.build([{ name, data }], option)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats')
    res.setHeader('Content-Disposition', 'attachment; filename=' + `${encodeURI(name)}.xlsx`)
    return res.end(buffer, 'binary')
  })

Server.start(namespace, Controller, resolve(__dirname, '../dist'), router)
