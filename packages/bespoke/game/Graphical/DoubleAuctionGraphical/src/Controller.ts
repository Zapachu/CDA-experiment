import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from '@bespoke/core'
import {ICreateParams, IGameState, IPlayerState, IPushParams, IMoveParams} from "./interface"
import {MoveType, PushType, PlayerStatus} from './config'
import {GameState} from './interface'
import {NEW_ROUND_TIMER} from './config'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
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
        const {game: {params: {groupSize, round, positions, countdown}}} = this
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
                            playerStatus: Array(groupSize).fill(PlayerStatus.outside)
                        }))
                    }
                    groupIndex = gameState.groups.push(group) - 1
                }
                playerState.groupIndex = groupIndex
                playerState.positionIndex = gameState.groups[groupIndex].playerNum++
                playerState.role = positions[playerState.positionIndex].role
                playerState.privatePrices = positions[playerState.positionIndex].privatePrice
                break
            case MoveType.prepare: {
                const {groupIndex, positionIndex} = playerState
                const {rounds, roundIndex} = gameState.groups[groupIndex]
                rounds[roundIndex].playerStatus[positionIndex] = PlayerStatus.prepared
                break
            }
            case MoveType.shout: {
                const {groupIndex, positionIndex} = playerState,
                    groupState = gameState.groups[groupIndex],
                    {rounds, roundIndex} = groupState,
                    {playerStatus} = rounds[roundIndex],
                    groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)
                playerStatus[positionIndex] = PlayerStatus.shouted
                playerState.prices[roundIndex] = params.price
                rounds[roundIndex].board = rounds[roundIndex].board || []
                const existIdx = rounds[roundIndex].board.findIndex(b => b.position === positionIndex)
                existIdx === -1 ? rounds[roundIndex].board.push({
                    deal: false,
                    price: params.price,
                    position: positionIndex,
                    role: playerState.role
                }) : rounds[roundIndex].board[existIdx].price = params.price

                const nextRound = async () => {
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
                        await this.stateManager.syncState()
                    }, 1000)
                }

                // the first one shout and start countdown
                if (!rounds[roundIndex].hasTimer) {
                    rounds[roundIndex].hasTimer = true
                    let timeAcc = 1
                    const countdownInterval = global.setInterval(async () => {
                        groupPlayerStates.forEach(({actor}) => this.push(actor, PushType.countdown, {
                            roundIndex,
                            countdown: timeAcc
                        }))
                        if (timeAcc++ < countdown) {
                            return
                        }
                        global.clearInterval(countdownInterval)
                        await this.stateManager.syncState()
                        await nextRound()
                    }, 1000)
                }
                break
            }
            case MoveType.deal: {
                const {groupIndex, positionIndex} = playerState,
                    groupState = gameState.groups[groupIndex],
                    {rounds, roundIndex} = groupState,
                    {playerStatus} = rounds[roundIndex],
                    groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)

                // status change
                playerStatus[positionIndex] = PlayerStatus.dealed
                playerStatus[params.position] = PlayerStatus.dealed

                // profit calculate
                playerState.profits[roundIndex] = playerState.privatePrices[roundIndex] - params.price
                groupPlayerStates[params.position].profits[roundIndex] = groupPlayerStates[params.position].privatePrices[roundIndex] - playerState.prices[roundIndex]

                // find board item
                const curBoardIdx = rounds[roundIndex].board.findIndex(b => b.position === params.position)
                const targetBoardIdx = rounds[roundIndex].board.findIndex(b => b.position === positionIndex)

                // mark board item as deal = true
                if (curBoardIdx !== -1) rounds[roundIndex].board[curBoardIdx].deal = true
                if (targetBoardIdx !== -1) rounds[roundIndex].board[targetBoardIdx].deal = true

                // synchronized status
                await this.stateManager.syncState()

                // if everyone dealed, jump to next round
                if (playerStatus.every(p => p === PlayerStatus.dealed)) {

                    // if all rounds over, synchronize all players status as game over
                    if (roundIndex == rounds.length - 1) {
                        for (let i in playerStatus) playerStatus[i] = PlayerStatus.gameOver
                        await this.stateManager.syncState()
                        return
                    }

                    // timer to next round
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
                        await this.stateManager.syncState()
                    }, 1000)
                }
                break
            }
        }
    }
}
