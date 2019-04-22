import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from "bespoke-server"
import {ICreateParams, IGameState, IPlayerState, IPushParams, IMoveParams} from "./interface"
import {MoveType, PushType, FetchType, PlayerStatus} from './config'
import {GameState} from './interface'
import {NEW_ROUND_TIMER} from './config'

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
        const {game: {params: {groupSize, round, fishCount, magnification}}} = this
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
                const groupState = gameState.groups[groupIndex]
                const {rounds, roundIndex} = groupState
                if (!rounds[roundIndex].fishLeft) {
                    rounds[roundIndex].fishLeft = fishCount
                }
                break
            case MoveType.prepare: {
                const {groupIndex, positionIndex} = playerState
                const {rounds, roundIndex} = gameState.groups[groupIndex]
                rounds[roundIndex].playerStatus[positionIndex] = PlayerStatus.prepared
                break
            }
            case MoveType.toNextRound: {
                const {groupIndex, positionIndex} = playerState,
                    groupState = gameState.groups[groupIndex],
                    {rounds, roundIndex} = groupState,
                    {playerStatus} = rounds[roundIndex],
                    groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)
                rounds[roundIndex].playerStatus[positionIndex] = PlayerStatus.preparedNextRound
                if (playerStatus.every(status => status === PlayerStatus.preparedNextRound)) {
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
                playerState.profits[roundIndex] = params.price
                rounds[roundIndex].fishLeft -= params.price
                await this.stateManager.syncState()
                if (playerStatus.every(p => p === PlayerStatus.shouted)) {
                    const lastFish = rounds[roundIndex].fishLeft * magnification
                    const everyGet = lastFish / groupSize
                    groupPlayerStates.map(p => {
                        p.profits[roundIndex] += parseInt(everyGet.toString())
                    })
                    for (const i in playerStatus) {
                        playerStatus[i] = PlayerStatus.nextRound
                    }
                    await this.stateManager.syncState()
                }
                break
            }
        }
    }
}
