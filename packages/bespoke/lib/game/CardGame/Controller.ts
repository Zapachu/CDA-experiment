import {BaseController, baseEnum, IActor, IMoveCallback, TGameState, TPlayerState} from 'server-vendor'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import {FetchType, GameType, MoveType, PushType, Role, cardGame, LRGame, PlayerStatus} from './config'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.periods = []
        gameState.periodIndex = 0
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        playerState.periodIndices = []
        playerState.profit = 0
        return playerState
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {game: {params: {vsRobot, gameType}}} = this
        const playerStates = await this.stateManager.getPlayerStates(),
            playerState = await this.stateManager.getPlayerState(actor),
            gameState = await this.stateManager.getGameState()
        switch (type) {
            case MoveType.getRole: {
                if (playerState.role !== undefined) {
                    break
                }
                if (vsRobot) {
                    playerState.role = Math.random() > 0.5 ? Role.A : Role.B
                } else {
                    const pairEntry = Object.entries(playerStates)
                        .find(([token, state]) => token !== actor.token && state.pairId === undefined)
                    if (!pairEntry) {
                        playerState.role = Role.A
                        break
                    }
                    playerState.role = Role.B
                    playerState.pairId = pairEntry[0]
                    pairEntry[1].pairId = actor.token
                }
                break
            }
            case MoveType.submitMove: {
                const {choice} = params
                if (vsRobot) {
                } else {
                    const hisState = playerStates[playerState.pairId]
                    if (hisState.choice === undefined) {
                        playerState.choice = choice
                        playerState.playerStatus = PlayerStatus.waiting
                    } else {
                        const [aChoice, bChoice] = isA() ? [choice, hisState.choice] : [hisState.choice, choice]
                        const {aEarning, bEarning, dieRoll} = calcResult(aChoice, bChoice)
                        const [myEarning, hisEarning] = isA() ? [aEarning, bEarning] : [bEarning, aEarning]
                        const roundRecord = {
                            index: gameState.periodIndex++,
                            aChoice,
                            bChoice,
                            aEarning,
                            bEarning,
                            dieRoll
                        }
                        gameState.periods.push(roundRecord)
                        playerState.periodIndices.push(roundRecord.index)
                        playerState.profit += myEarning
                        playerState.playerStatus = PlayerStatus.result
                        hisState.choice = undefined
                        hisState.periodIndices.push(roundRecord.index)
                        hisState.profit += hisEarning
                        hisState.playerStatus = PlayerStatus.result
                    }
                }
                break
            }
            case MoveType.proceed: {
                playerState.playerStatus = PlayerStatus.playing
                playerStates[playerState.pairId].playerStatus = PlayerStatus.playing
            }
        }

        function isA(): boolean {
            return playerState.role === Role.A
        }

        function calcResult(aChoice: number, bChoice: number): {
            aEarning: number, bEarning: number, dieRoll?: number
        } {
            switch (gameType) {
                case GameType.Card: {
                    const [aEarning, bEarning] = cardGame.outcomeMatrix4Player1[aChoice][bChoice]
                    return {aEarning, bEarning}
                }
                case GameType.LeftRight: {
                    const dieRoll = ~~(Math.random() * 6) + 1
                    const matrix = dieRoll > 2 ? LRGame.outcomeMatrix4Player1.big : LRGame.outcomeMatrix4Player1.small
                    const [aEarning, bEarning] = matrix[aChoice][bChoice]
                    return {aEarning, bEarning, dieRoll}
                }
            }
        }
    }

    async handleFetch(req, res): Promise<void> {
        const {query: {type}} = req
        console.log(type)
        switch (type) {
            case FetchType.getRobotInputSeqList: {
                res.json({
                    code: baseEnum.ResponseCode.success,
                    historyGames: []
                })
                break
            }
        }
    }
}