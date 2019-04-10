import nodeXlsx from 'node-xlsx'
import {BaseController, IActor, IMoveCallback, TGameState, FreeStyleModel, baseEnum, TPlayerState} from 'bespoke-server'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import {FetchType, MoveType, GameStage, PushType, SheetType, IResult, QUESTIONS, PlayerStage} from './config'

const QUESTION_ANSWERS: Array<string> = ['0.05', '5', '47', '4', '29', '20', 'C'];

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    private timer: NodeJS.Timer

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.gameStage = GameStage.seatNumber
        gameState.time = 0
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        playerState.answers = []
        return playerState
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
                playerState.index = 0
                break
            }
            case MoveType.answer: {
                playerState.answers[playerState.index] = params.answer
                if(playerState.index >= QUESTIONS.length-1) {
                    this.calcResult(playerState)
                } else {
                    playerState.index += 1;
                }
                break
            }
        }
    }

    async onGameOver(): Promise<void> {
        await this.handleGameOver()
    }

    async handleGameOver(): Promise<void> {
        global.clearInterval(this.timer)
        const playerStates = await this.stateManager.getPlayerStates()
        const tasks = Object.values(playerStates).map(async playerState => {
            if(playerState.playerStage !== PlayerStage.over) {
                await this.calcResult(playerState)
            }
        })
        await Promise.all(tasks)
    }

    protected async teacherMoveReducer(actor: IActor, type: string, params: IMoveParams, cb?: IMoveCallback): Promise<void> {
        const {game: {params: {timeLimit}}} = this
        const gameState = await this.stateManager.getGameState()
        switch (type) {
            case MoveType.startMainTest: {
                gameState.gameStage = GameStage.mainTest
                this.timer = global.setInterval(async () => {
                    if (gameState.status !== baseEnum.GameStatus.started) {
                        return
                    }
                    if (gameState.time++ >= timeLimit*60) {
                        await this.handleGameOver()
                    }
                    await this.stateManager.syncState()
                }, 1000)
            }
        }
    }


    async handleFetch(req, res): Promise<void> {
        const {query: {type, sheetType}} = req
        switch (type) {
            case FetchType.exportXls: {
                if(req.user.id !== this.game.owner){
                    return res.end('Invalid Request')
                }
                const name = SheetType[sheetType]
                let data = [], option = {}
                switch (sheetType) {
                    case SheetType.result: {
                        data.push(['被试编号', '题目序号', '正确答案', '被试答案', '是否正确'])
                        const logs: Array<{ data: IResult }> = await FreeStyleModel.find({
                            game: this.game.id,
                            key: SheetType.result
                        }) as any
                        logs.forEach(({data: {seatNumber, answers}}) => {
                            answers.forEach((ans, i) => {
                                data.push([seatNumber, i+1, QUESTION_ANSWERS[i], ans, ans===QUESTION_ANSWERS[i]?'是':'否'])
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
        }
    }

    calcResult = async (playerState: IPlayerState) => {
        let correctNumber = 0;
        playerState.answers.forEach((ans, i) => {
            if(ans === QUESTION_ANSWERS[i]) correctNumber++;
        })
        const point = Number((correctNumber * this.game.params.exchangeRate).toFixed(2))
        playerState.correctNumber = correctNumber
        playerState.point = point
        playerState.playerStage = PlayerStage.over
        const data: IResult = {
            seatNumber: playerState.seatNumber,
            answers: playerState.answers
        }
        await new FreeStyleModel({
            game: this.game.id,
            key: SheetType.result,
            data
        }).save()
    }
}
