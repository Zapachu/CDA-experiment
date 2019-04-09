import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from "bespoke-server";
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from "./interface";
import {Balls, FetchType, MoveType, NEW_ROUND_TIMER, PlayerStatus, PushType} from './config'


const genCupAndBall = () => {
    const genRan = ({L, H}) => ~~(Math.random() * (H - L)) + L

    const cupsAndBalls = [[Balls.red, Balls.red, Balls.blue], [Balls.red, Balls.blue, Balls.blue]]
    const cupIdx = genRan({L: 0, H: 2})
    const ballIdx = genRan({L: 0, H: 3})
    return {
        cup: cupIdx,
        ball: cupsAndBalls[cupIdx][ballIdx]
    }
}

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.groups = []
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const {game: {params: {round}}} = this
        const playerState = await super.initPlayerState(actor)
        playerState.prices = Array(round).fill(null)
        playerState.profits = Array(round).fill(0)
        return playerState
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {game: {params: {groupSize, round, rightReward, falseReward}}} = this
        const playerState = await this.stateManager.getPlayerState(actor),
            gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates()
        switch (type) {
            case MoveType.getPosition:
                if (playerState.groupIndex !== undefined) {
                    break
                }
                let groupIndex = gameState.groups.findIndex(({playerNum}) => playerNum < groupSize)
                if (groupIndex === -1) {
                    const group: GameState.IGroup = {
                        roundIndex: 0,
                        playerNum: 0,
                        rounds: Array(round).fill(null).map<GameState.Group.IRound>(() => ({
                            playerStatus: Array(groupSize).fill(PlayerStatus.prepared)
                        }))
                    }
                    groupIndex = gameState.groups.push(group) - 1
                }
                playerState.groupIndex = groupIndex
                playerState.positionIndex = gameState.groups[groupIndex].playerNum++

                const {rounds, roundIndex} = gameState.groups[groupIndex]

                if (playerState.positionIndex === 0) {
                    const {cup, ball} = genCupAndBall()
                    rounds[roundIndex].cup = cup
                    rounds[roundIndex].ball = ball
                    rounds[roundIndex].cups = []
                }
                if (rounds[roundIndex].playerStatus.every(s => s === PlayerStatus.prepared)) {
                    if (!rounds[roundIndex].currentPlayer) {
                        rounds[roundIndex].currentPlayer = 0
                        rounds[roundIndex].playerStatus[rounds[roundIndex].currentPlayer] = PlayerStatus.timeToShout
                    }
                }
                break
            case MoveType.shout: {

                const {groupIndex, positionIndex} = playerState,
                    groupState = gameState.groups[groupIndex],
                    {rounds, roundIndex} = groupState,
                    {playerStatus} = rounds[roundIndex],
                    groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)

                playerState.prices[roundIndex] = params.price
                playerStatus[positionIndex] = PlayerStatus.shouted
                playerState.profits[roundIndex] = params.price === rounds[roundIndex].cup ? rightReward : falseReward

                rounds[roundIndex].cups.push(params.price)
                rounds[roundIndex].currentPlayer += 1

                if (rounds[roundIndex].currentPlayer < groupSize) {
                    rounds[roundIndex].playerStatus[rounds[roundIndex].currentPlayer] = PlayerStatus.timeToShout
                }

                if (playerStatus.every(status => status === PlayerStatus.shouted)) {
                    await this.stateManager.syncState()
                    if (roundIndex == rounds.length - 1) {
                        for (let i in playerStatus) playerStatus[i] = PlayerStatus.gameOver
                        await this.stateManager.syncState()
                        return
                    }
                    let newRoundTimer = 1
                    const newRoundInterval = global.setInterval(async () => {
                        groupPlayerStates.forEach(({actor}) => this.push(actor, PushType.newRoundTimer, {
                            roundIndex,
                            newRoundTimer
                        }))
                        if (newRoundTimer++ < NEW_ROUND_TIMER) {
                            return
                        }
                        global.clearInterval(newRoundInterval)
                        groupState.roundIndex++
                        rounds[groupState.roundIndex].currentPlayer = 0
                        rounds[groupState.roundIndex].playerStatus[0] = PlayerStatus.timeToShout
                        const {cup, ball} = genCupAndBall()
                        rounds[groupState.roundIndex].cup = cup
                        rounds[groupState.roundIndex].cups = []
                        rounds[groupState.roundIndex].ball = ball
                        await this.stateManager.syncState()
                    }, 1000)
                }
            }
        }
    }
}
