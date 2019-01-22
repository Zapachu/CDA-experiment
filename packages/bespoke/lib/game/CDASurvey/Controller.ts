import nodeXlsx from 'node-xlsx'
import {BaseController, IActor, IMoveCallback, TGameState, FreeStyleModel} from 'server-vendor'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import {FetchType, MoveType, GameStage, PushType, SheetType, IResult, SURVEY_STAGE, SURVEY_BASIC, SURVEY_FEEDBACK, SURVEY_TEST} from './config'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.gameStage = GameStage.seatNumber
        return gameState
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb?: IMoveCallback): Promise<void> {
        const playerStates = await this.stateManager.getPlayerStates(),
            playerState = await this.stateManager.getPlayerState(actor)
        switch (type) {
            case MoveType.submitSeatNumber: {
                const hasBeenOccupied = Object.values(playerStates).some(({seatNumber}) => seatNumber === params.seatNumber)
                if (hasBeenOccupied) {
                    cb(false)
                    break
                }
                playerState.seatNumber = params.seatNumber
                break
            }
            case MoveType.answerSurvey: {
                switch (params.stage) {
                    case SURVEY_STAGE.basic:
                        Object.assign(playerState, {
                            surveyBasic: params.inputs,
                            surveyStage: SURVEY_STAGE.feedback
                        })
                        break
                    case SURVEY_STAGE.feedback:
                        Object.assign(playerState, {
                            surveyFeedback: params.inputs,
                            surveyStage: SURVEY_STAGE.test
                        })
                        break
                    case SURVEY_STAGE.test:
                        Object.assign(playerState, {
                            surveyTest: params.inputs,
                            surveyStage: SURVEY_STAGE.over
                        })
                        const data: IResult = {
                            seatNumber: playerState.seatNumber,
                            surveyBasic: playerState.surveyBasic,
                            surveyFeedback: playerState.surveyFeedback,
                            surveyTest: playerState.surveyTest,
                        }
                        await new FreeStyleModel({
                            game: this.game.id,
                            key: SheetType.result,
                            data
                        }).save()
                        break
                }
                break
            }
        }
    }

    protected async teacherMoveReducer(actor: IActor, type: string, params: IMoveParams, cb?: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState()
        switch (type) {
            case MoveType.startMainTest: {
                gameState.gameStage = GameStage.mainTest
            }
        }
    }


    async handleFetch(req, res): Promise<void> {
        const {query: {type, sheetType}} = req
        switch (type) {
            case FetchType.exportXls: {
                const name = SheetType[sheetType]
                let data = [], option = {}
                switch (sheetType) {
                    case SheetType.result: {
                        const header = ['被试编号'].concat(SURVEY_BASIC.map(a => a.title))
                                                .concat(SURVEY_FEEDBACK.map(a => {
                                                    if(a.blanks) {
                                                        return [a.title, ...a.blanks].toString()
                                                    }
                                                    return a.title
                                                }))
                                                .concat(SURVEY_TEST.map(a => a.title))
                        data.push(header)
                        const logs: Array<{ data: IResult }> = await FreeStyleModel.find({
                            game: this.game.id,
                            key: SheetType.result
                        }) as any
                        logs.forEach(({data: {seatNumber, surveyBasic, surveyFeedback, surveyTest}}) => {
                            const row = [seatNumber.toString()]
                            row.push(...surveyBasic)
                            row.push(...surveyFeedback.length===6
                                        ?[surveyFeedback[0], `${surveyFeedback[1]},${surveyFeedback[2]},${surveyFeedback[3]},${surveyFeedback[4]},`, '', surveyFeedback[5], '']
                                        :[surveyFeedback[0], '', `${surveyFeedback[1]},${surveyFeedback[2]}`, '', surveyFeedback[3]])
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
            }
        }
    }
}