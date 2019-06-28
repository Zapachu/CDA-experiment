import {resolve} from 'path'
import {BaseLogic, Model, Server} from 'bespoke-server'
import Controller from './Controller'
import {FetchRoute, IResult, namespace, SheetType} from './config'
import {Router} from 'express'
import nodeXlsx from 'node-xlsx'

const router = Router()
    .get(FetchRoute.exportXls, async (req, res) => {
            const {params: {gameId}, query: {sheetType}} = req
            const {game} = await BaseLogic.getLogic(gameId)
            if (req.user.id !== game.owner) {
                return res.end('Invalid Request')
            }
            const name = SheetType[sheetType]
            let data = [], option = {}
            switch (sheetType) {
                case SheetType.result: {
                    data.push(['seatNumber', 'correctNumber', 'point'])
                    const logs: Array<{ data: IResult }> = await Model.FreeStyleModel.find({
                        game: game.id,
                        key: SheetType.result
                    }) as any
                    logs.forEach(({data: {seatNumber, correctNumber, point}}) =>
                        data.push([seatNumber, correctNumber, point])
                    )
                    break
                }
            }
            let buffer = nodeXlsx.build([{name, data}], option)
            res.setHeader('Content-Type', 'application/vnd.openxmlformats')
            res.setHeader('Content-Disposition', 'attachment; filename=' + `${encodeURI(name)}.xlsx`)
            return res.end(buffer, 'binary')
        }
    )

Server.start(namespace, Controller, resolve(__dirname, '../dist'), router)
