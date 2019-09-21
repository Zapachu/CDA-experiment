import {resolve} from 'path';
import nodeXlsx from 'node-xlsx';
import {BaseLogic, Model, Server} from '@bespoke/server';
import Controller from './Controller';
import {FetchRoute, IAnwserLog, IResult, namespace, SheetType} from './config';
import {Router} from 'express';

const router = Router()
    .get(FetchRoute.exportXls, async (req: any, res) => {
        const {params:{gameId}, query: {sheetType}} = req
        const {game} = await BaseLogic.getLogic(gameId)
        if (req.user.id !== game.owner) {
            return res.end('Invalid Request')
        }
        const name = SheetType[sheetType]
        let data = [], option = {}
        switch (sheetType) {
            case SheetType.log: {
                data.push(['seatNumber', 'emotion', 'gender', 'time'])
                const logs: Array<{ data: IAnwserLog }> = await Model.FreeStyleModel.find({
                    game: game.id,
                    key: SheetType.log
                }) as any
                logs.forEach(({data: {seatNumber, emotion, gender, time}}) =>
                    data.push([seatNumber, emotion, gender, time])
                )
                break
            }
            case SheetType.result: {
                data.push(['seatNumber', 'emotion', 'gender', 'point'])
                const logs: Array<{ data: IResult }> = await Model.FreeStyleModel.find({
                    game: game.id,
                    key: SheetType.result
                }) as any
                logs.forEach(({data: {seatNumber, emotionNum, genderNum, point}}) =>
                    data.push([seatNumber, emotionNum, genderNum, point])
                )
                break
            }
        }
        let buffer = nodeXlsx.build([{name, data}], option)
        res.setHeader('Content-Type', 'application/vnd.openxmlformats')
        res.setHeader('Content-Disposition', 'attachment; filename=' + `${encodeURI(name)}.xlsx`)
        return res.end(buffer, 'binary')
    })

Server.start(namespace, Controller, resolve(__dirname, '../dist'), router)
