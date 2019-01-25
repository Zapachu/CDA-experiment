import nodeXlsx from 'node-xlsx'
import {BaseController, IActor, IMoveCallback, TGameState, FreeStyleModel,baseEnum} from 'server-vendor'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import {FetchType, MoveType, GameStage, PushType, SheetType, IResult} from './config'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    private timer: NodeJS.Timer

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.gameStage = GameStage.seatNumber
        gameState.time = -5
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
            case MoveType.countReaction: {
                if(!playerState.correctNumber) {
                    playerState.correctNumber = 0
                }
                playerState.correctNumber++
                break
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
            if (!playerState.correctNumber) {
                playerState.correctNumber = 0
            }
            const point = Number((playerState.correctNumber * exchangeRate).toFixed(2))
            playerState.point = point
            const data: IResult = {
                seatNumber: playerState.seatNumber,
                correctNumber: playerState.correctNumber,
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
                    if (gameState.status !== baseEnum.GameStatus.started) {
                        return
                    }
                    if (gameState.time++ >= timeLimit) {
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
                    case SheetType.result: {
                        data.push(['seatNumber', 'correctNumber', 'point'])
                        const logs: Array<{ data: IResult }> = await FreeStyleModel.find({
                            game: this.game.id,
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
        }
    }
}