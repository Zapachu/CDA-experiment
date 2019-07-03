import {BaseController, IActor, IMoveCallback, TGameState, Model} from '@bespoke/core'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import {MoveType, GameStage, PushType, SheetType, IResult, SURVEY_STAGE, SURVEY_BASIC, SURVEY_FEEDBACK, SURVEY_TEST} from './config'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {

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
                        await new Model.FreeStyleModel({
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
}
