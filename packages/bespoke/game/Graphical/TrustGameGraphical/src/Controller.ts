import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from '@bespoke/core'
import {ICreateParams, IGameState, IPlayerState, IPushParams, IMoveParams} from "./interface"
import {MoveType, PushType} from './config'
import {GameState} from "./interface"
import {NEW_ROUND_TIMER, PlayerStatus} from "./config"

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
        playerState.balances = Array(round).fill(0)
        return playerState
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {game: {params: {group: groupNum, groupParams, groupSize, round}}} = this
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

                const {rounds, roundIndex} = gameState.groups[groupIndex]

                if (gameState.groups.length > groupNum) {
                    rounds[roundIndex].playerStatus = Array(gameState.groups[groupIndex].playerNum).fill(PlayerStatus.memberFull)
                    break
                }

                if (playerState.positionIndex === 0) {
                    playerState.balances[roundIndex] = groupParams[groupIndex].initialFunding
                }
                break
            case MoveType.prepare: {
                const {groupIndex, positionIndex} = playerState
                const {rounds, roundIndex} = gameState.groups[groupIndex]
                rounds[roundIndex].playerStatus[positionIndex] = PlayerStatus.prepared
                if (rounds[roundIndex].playerStatus.every(s => s === PlayerStatus.prepared)) {
                    if (!rounds[roundIndex].currentPlayer) {
                        rounds[roundIndex].currentPlayer = 0
                        rounds[roundIndex].playerStatus[rounds[roundIndex].currentPlayer] = PlayerStatus.timeToShout
                    }
                }
                break
            }
            case MoveType.toNextRound : {
                const {groupIndex, positionIndex} = playerState,
                    groupState = gameState.groups[groupIndex],
                    {rounds, roundIndex} = groupState,
                    {playerStatus} = rounds[roundIndex],
                    groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)
                rounds[roundIndex].playerStatus[positionIndex] = PlayerStatus.preparedNextRound
                if (playerStatus.every(status => status === PlayerStatus.preparedNextRound)) {
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
                        groupPlayerStates[0].balances[groupState.roundIndex] = groupParams[groupIndex].initialFunding
                        await this.stateManager.syncState()
                    }, 1000)
                }
                break
            }
            case MoveType.shout: {

                const {groupIndex, positionIndex} = playerState,
                    groupState = gameState.groups[groupIndex],
                    {rounds, roundIndex} = groupState,
                    {playerStatus, currentPlayer} = rounds[roundIndex],
                    groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)

                playerState.prices[roundIndex] = params.price
                playerStatus[positionIndex] = PlayerStatus.shouted

                if (currentPlayer === 0) {
                    playerState.balances[roundIndex] -= params.price
                    groupPlayerStates[1].balances[roundIndex] += params.price * groupParams[groupIndex].magnification
                }

                if (currentPlayer === 1) {
                    playerState.balances[roundIndex] -= params.price
                    groupPlayerStates[0].balances[roundIndex] += params.price
                }

                rounds[roundIndex].currentPlayer += 1

                if (rounds[roundIndex].currentPlayer < groupSize) {
                    rounds[roundIndex].playerStatus[rounds[roundIndex].currentPlayer] = PlayerStatus.timeToShout
                }

                if (playerStatus.every(status => status === PlayerStatus.shouted)) {
                    groupPlayerStates.map(p => p.profits[roundIndex] = p.balances[roundIndex])
                    for (let i = 0; i < rounds[roundIndex].playerStatus.length; i++) {
                        rounds[roundIndex].playerStatus[i] = PlayerStatus.nextRound
                    }
                    await this.stateManager.syncState()
                    if (roundIndex == rounds.length - 1) {
                        for (let i in playerStatus) playerStatus[i] = PlayerStatus.gameOver
                        await this.stateManager.syncState()
                        return
                    }
                }
            }
        }
    }
}
