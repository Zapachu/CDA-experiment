import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from "bespoke-server";
import {ICreateParams, IGameState, IPlayerState, IPushParams, IMoveParams} from "./interface";
import {MoveType, PushType, FetchType} from './config'
import {GameState} from "./interface";
import {NEW_ROUND_TIMER, PlayerStatus} from "./config";

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
        const {game: {params: {groupSize, round, initialFunding, returnOnInvestment}}} = this
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
                playerStatus[positionIndex] = PlayerStatus.shouted
                playerState.prices[roundIndex] = params.price
                rounds[roundIndex].currentPlayer += 1
                if (rounds[roundIndex].currentPlayer < groupSize) {
                    rounds[roundIndex].playerStatus[rounds[roundIndex].currentPlayer] = PlayerStatus.timeToShout
                }
                if (playerStatus.every(status => status === PlayerStatus.shouted)) {
                    const share = returnOnInvestment * groupPlayerStates.map(p => p.prices[roundIndex]).reduce((p, c) => p + c) / groupSize
                    groupPlayerStates.map(p => p.profits[roundIndex] = initialFunding - p.prices[roundIndex] + share)
                    await this.stateManager.syncState()
                    if (roundIndex == rounds.length - 1) {
                        return
                    }
                    let newRoundTimer = 1
                    const newRoundInterval = global.setInterval(async () => {
                        groupPlayerStates.forEach(({actor}) => this.push(actor, PushType.newRoundTimer, {
                            roundIndex,
                            newRoundTimer
                        }))
                        if (newRoundTimer++ < NEW_ROUND_TIMER) {
                            for (let i in playerStatus) playerStatus[i] = PlayerStatus.gameOver
                            await this.stateManager.syncState()
                            return
                        }
                        global.clearInterval(newRoundInterval)
                        groupState.roundIndex++
                        rounds[groupState.roundIndex].currentPlayer = 0
                        rounds[groupState.roundIndex].playerStatus[0] = PlayerStatus.timeToShout
                        await this.stateManager.syncState()
                    }, 1000)
                }
            }
        }
    }
}
