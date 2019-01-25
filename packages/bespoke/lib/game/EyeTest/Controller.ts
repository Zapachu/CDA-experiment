import nodeXlsx from 'node-xlsx'
import {BaseController, IActor, IMoveCallback, TGameState, FreeStyleModel} from 'server-vendor'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import {FetchType, MoveType, GameStage, PushType, GENDER, SheetType, IAnwserLog, IResult, EYES} from './config'
import {GameStatus} from '../../core/common/baseEnum'

const RIGHT_ANSWER = [
    {emotion: 0, gender: GENDER.male},
    {emotion: 1, gender: GENDER.male},
    {emotion: 2, gender: GENDER.female},
    {emotion: 1, gender: GENDER.male},
    {emotion: 2, gender: GENDER.male},
    {emotion: 1, gender: GENDER.female},
    {emotion: 2, gender: GENDER.male},
    {emotion: 0, gender: GENDER.male},
    {emotion: 3, gender: GENDER.female},
    {emotion: 0, gender: GENDER.male},
    {emotion: 2, gender: GENDER.male},
    {emotion: 2, gender: GENDER.male},
    {emotion: 1, gender: GENDER.male},
    {emotion: 3, gender: GENDER.male},
    {emotion: 0, gender: GENDER.female},
    {emotion: 1, gender: GENDER.male},
    {emotion: 0, gender: GENDER.female},
    {emotion: 0, gender: GENDER.female},
    {emotion: 3, gender: GENDER.female},
    {emotion: 1, gender: GENDER.male},
    {emotion: 1, gender: GENDER.female},
    {emotion: 0, gender: GENDER.female},
    {emotion: 2, gender: GENDER.male},
    {emotion: 0, gender: GENDER.male},
    {emotion: 3, gender: GENDER.female},
    {emotion: 2, gender: GENDER.male},
    {emotion: 1, gender: GENDER.female},
    {emotion: 0, gender: GENDER.female},
    {emotion: 3, gender: GENDER.female},
    {emotion: 1, gender: GENDER.female},
    {emotion: 1, gender: GENDER.female},
    {emotion: 0, gender: GENDER.male},
    {emotion: 3, gender: GENDER.male},
    {emotion: 2, gender: GENDER.female},
    {emotion: 1, gender: GENDER.female},
    {emotion: 2, gender: GENDER.male}
]
export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    private timer: NodeJS.Timer

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.gameStage = GameStage.seatNumber
        gameState.time = 0
        return gameState
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const playerStates = await this.stateManager.getPlayerStates(),
            playerState = await this.stateManager.getPlayerState(actor),
            gameState = await this.stateManager.getGameState()
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
            case MoveType.anwser: {
                if (!playerState.anwsers) {//例题
                    playerState.anwsers = []
                } else {
                    const {newanwser: {index, emotion, gender}} = params
                    playerState.anwsers[index] = {
                        emotion, gender, time: gameState.time
                    }
                    const data: IAnwserLog = {
                        seatNumber: playerState.seatNumber,
                        emotion,
                        gender,
                        time: gameState.time
                    }
                    await new FreeStyleModel({
                        game: this.game.id,
                        key: SheetType.log,
                        data
                    }).save()
                    if(playerState.anwsers.length === EYES.length) {
                            let emotionNum = 0, genderNum = 0
                            playerState.anwsers.forEach(({emotion, gender}, index) => {
                                const rightAnwser = RIGHT_ANSWER[index]
                                emotion === rightAnwser.emotion ? emotionNum++ : null
                                gender === rightAnwser.gender ? genderNum++ : null
                            })
                            const point = Number((emotionNum * this.game.params.exchangeRate).toFixed(2))
                            playerState.result = {
                                emotionNum, genderNum, point
                            }

                }
                break
            }
        }
      }
    }

    async onGameOver(): Promise<void> {
        await this.handleGameOver()
    }

    async handleGameOver(): Promise<void> {
        const {game: {params: {exchangeRate}}} = this
        const gameState = await this.stateManager.getGameState()
        global.clearInterval(this.timer)
        const playerStates = await this.stateManager.getPlayerStates()
        Object.values(playerStates).forEach(async playerState => {
            let emotionNum = 0, genderNum = 0
            if (!playerState.anwsers) {
                playerState.result = {
                    emotionNum, genderNum, point: 0
                }
                return
            }
            playerState.anwsers.forEach(({emotion, gender}, index) => {
                const rightAnwser = RIGHT_ANSWER[index]
                emotion === rightAnwser.emotion ? emotionNum++ : null
                gender === rightAnwser.gender ? genderNum++ : null
            })
            const point = Number((emotionNum * exchangeRate).toFixed(2))
            playerState.result = {
                emotionNum, genderNum, point
            }
            const data: IResult = {
                seatNumber: playerState.seatNumber,
                emotionNum,
                genderNum,
                point
            }
            await new FreeStyleModel({
                game: this.game.id,
                key: SheetType.result,
                data
            }).save()
        })
        gameState.gameStage = GameStage.result
    }

    protected async teacherMoveReducer(actor: IActor, type: string, params: IMoveParams, cb?: IMoveCallback): Promise<void> {
        const {game: {params: {timeLimit}}} = this
        const gameState = await this.stateManager.getGameState()
        switch (type) {
            case MoveType.startMainTest: {
                gameState.gameStage = GameStage.mainTest
                this.timer = global.setInterval(async () => {
                    if (gameState.status !== GameStatus.started) {
                        return
                    }
                    if (gameState.time++ >= timeLimit * 60) {
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
                const name = SheetType[sheetType]
                let data = [], option = {}
                switch (sheetType) {
                    case SheetType.log: {
                        data.push(['seatNumber', 'emotion', 'gender', 'time'])
                        const logs: Array<{ data: IAnwserLog }> = await FreeStyleModel.find({
                            game: this.game.id,
                            key: SheetType.log
                        }) as any
                        logs.forEach(({data: {seatNumber, emotion, gender, time}}) =>
                            data.push([seatNumber, emotion, gender, time])
                        )
                        break
                    }
                    case SheetType.result: {
                        data.push(['seatNumber', 'emotion', 'gender', 'point'])
                        const logs: Array<{ data: IResult }> = await FreeStyleModel.find({
                            game: this.game.id,
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
            }
        }
    }
}
