import {resolve} from 'path'
import {Server,Model, BaseLogic} from 'bespoke-server'
import Controller from './Controller'
import {FetchRoute, IResult, namespace, SheetType, SURVEY_BASIC, SURVEY_FEEDBACK, SURVEY_TEST} from './config'
import {Router} from 'express'
import nodeXlsx from 'node-xlsx'

const router = Router()
    .get(FetchRoute.exportXls, async (req, res) => {
        const {params:{gameId}, query: {sheetType}} = req
        const {game} = await BaseLogic.getLogic(gameId)
        if (req.user.id !== game.owner) {
            return res.end('Invalid Request')
        }
        const name = SheetType[sheetType]
        let data = [], option = {}
        switch (sheetType) {
            case SheetType.result: {
                const header = ['被试编号'].concat(SURVEY_BASIC.map(a => a.title))
                    .concat(SURVEY_FEEDBACK.map(a => {
                        if (a.blanks) {
                            return [a.title, ...a.blanks].toString()
                        }
                        return a.title
                    }))
                    .concat(SURVEY_TEST.map(a => a.title))
                data.push(header)
                const logs: Array<{ data: IResult }> = await Model.FreeStyleModel.find({
                    game: game.id,
                    key: SheetType.result
                }) as any
                logs.forEach(({data: {seatNumber, surveyBasic, surveyFeedback, surveyTest}}) => {
                    const row = [seatNumber.toString()]
                    row.push(...surveyBasic)
                    row.push(...surveyFeedback.length === 6
                        ? [surveyFeedback[0], `${surveyFeedback[1]},${surveyFeedback[2]},${surveyFeedback[3]},${surveyFeedback[4]},`, '', surveyFeedback[5], '']
                        : [surveyFeedback[0], '', `${surveyFeedback[1]},${surveyFeedback[2]}`, '', surveyFeedback[3]])
                    row.push(...surveyTest)
                    data.push(row)
                })
                break
            }
        }
        let buffer = nodeXlsx.build([{name, data}], option)
        res.setHeader('Content-Type', 'application/vnd.openxmlformats')
        res.setHeader('Content-Disposition', 'attachment; filename=' + `${encodeURI(name)}.xlsx`)
        return res.end(buffer, 'binary')
    })

Server.start({
    namespace,
    staticPath: resolve(__dirname, '../dist')
}, {Controller}, router)
