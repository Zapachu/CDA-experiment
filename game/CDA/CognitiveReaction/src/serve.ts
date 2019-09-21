import {resolve} from 'path';
import {BaseLogic, Model, Server} from '@bespoke/server';
import {Controller, QUESTION_ANSWERS} from './Controller';
import nodeXlsx from 'node-xlsx';
import {FetchRoute, IResult, namespace, SheetType} from './config';
import {Router} from 'express';

const router = Router()
    .get(FetchRoute.exportXls, async (req: any, res) => {
            const {params: {gameId}, query: {sheetType}} = req
            const {game} = await BaseLogic.getLogic(gameId)
            if (req.user.id !== game.owner) {
                return res.end('Invalid Request')
            }
            const name = SheetType[sheetType]
            let data = [], option = {}
            switch (sheetType) {
                case SheetType.result: {
                    data.push(['被试编号', '题目序号', '正确答案', '被试答案', '是否正确'])
                    const logs: Array<{ data: IResult }> = await Model.FreeStyleModel.find({
                        game: game.id,
                        key: SheetType.result
                    }) as any
                    logs.forEach(({data: {seatNumber, answers}}) => {
                        answers.forEach((ans, i) => {
                            data.push([seatNumber, i + 1, QUESTION_ANSWERS[i], ans, ans === QUESTION_ANSWERS[i] ? '是' : '否'])
                        })
                    })
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
