import { resolve } from 'path'
import { BaseLogic, Model, Server } from '@bespoke/server'
import Controller from './Controller'
import Robot from './Robot'
import {
  DBKey,
  FetchRoute,
  ISeatNumberRow,
  namespace,
  RobotCalcLog,
  RobotSubmitLog,
  SheetType,
  ShoutResult
} from './config'
import { Router } from 'express'
import { getEnumKeys } from './util'
import nodeXlsx from 'node-xlsx'
import { RobotServer } from '@bespoke/robot'

const router = Router().get(FetchRoute.exportXls, async (req: any, res) => {
  const {
    params: { gameId },
    query: { sheetType }
  } = req
  const { game, stateManager } = await BaseLogic.getLogic(gameId)
  if (req.user.id !== game.owner) {
    return res.end('Invalid Request')
  }
  const name = SheetType[sheetType]
  let data = [],
    option = {}
  switch (sheetType) {
    case SheetType.robotCalcLog: {
      data.push([
        'seq',
        'Subject',
        'role',
        'box',
        'R',
        'A',
        'q',
        'tau',
        'beta',
        'p',
        'delta',
        'r',
        'LagGamma',
        'Gamma',
        'ValueCost',
        'u',
        'CalculatedPrice',
        'Timestamp'
      ])
      const robotCalcLogs: Array<{
        data: RobotCalcLog
      }> = (await Model.FreeStyleModel.find({
        game: game.id,
        key: DBKey.robotCalcLog
      })) as any
      robotCalcLogs
        .sort(({ data: { seq: m } }, { data: { seq: n } }) => m - n)
        .forEach(
          ({
            data: {
              seq,
              playerSeq,
              role,
              unitIndex,
              R,
              A,
              q,
              tau,
              beta,
              p,
              delta,
              r,
              LagGamma,
              Gamma,
              ValueCost,
              u,
              CalculatedPrice,
              timestamp
            }
          }) =>
            data.push(
              [
                seq,
                playerSeq,
                role,
                unitIndex + 1,
                R,
                A,
                q,
                tau,
                beta,
                p,
                delta,
                r,
                LagGamma,
                Gamma,
                ValueCost,
                u,
                CalculatedPrice,
                timestamp
              ].map(v => (typeof v === 'number' && v % 1 ? v.toFixed(2) : v))
            )
        )
      break
    }
    case SheetType.robotSubmitLog: {
      data.push([
        'seq',
        'Subject',
        'role',
        'box',
        'ValueCost',
        'Price',
        'BuyOrders',
        'SellOrders',
        `ShoutResult:${getEnumKeys(ShoutResult).join('/')}`,
        'MarketBuyOrders',
        'MarketSellOrders',
        'Timestamp'
      ])
      const robotSubmitLogs: Array<{
        data: RobotSubmitLog
      }> = (await Model.FreeStyleModel.find({
        game: game.id,
        key: DBKey.robotSubmitLog
      })) as any
      robotSubmitLogs
        .sort(({ data: { seq: m } }, { data: { seq: n } }) => m - n)
        .forEach(
          ({
            data: {
              seq,
              playerSeq,
              role,
              unitIndex,
              ValueCost,
              price,
              buyOrders,
              sellOrders,
              shoutResult,
              marketBuyOrders,
              marketSellOrders,
              timestamp
            }
          }) =>
            data.push(
              [
                seq,
                playerSeq,
                role,
                unitIndex + 1,
                ValueCost,
                price,
                buyOrders,
                sellOrders,
                `${shoutResult + 1}:${ShoutResult[shoutResult]}`,
                marketBuyOrders,
                marketSellOrders,
                timestamp
              ].map(v => (typeof v === 'number' && v % 1 ? v.toFixed(2) : v))
            )
        )
      break
    }
    case SheetType.seatNumber: {
      data.push(['Subject', 'seatNumber'])
      const seatNumberRows: Array<{
        data: ISeatNumberRow
      }> = (await Model.FreeStyleModel.find({
        game: game.id,
        key: DBKey.seatNumber
      })) as any
      seatNumberRows.forEach(({ data: { seatNumber, playerSeq } }) => data.push([playerSeq, seatNumber]))
      break
    }
    default: {
      const gameState = await stateManager.getGameState()
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

Server.start(namespace, Controller, resolve(__dirname, '../dist'), router, { port: 4000 })

RobotServer.start(namespace, Robot)
