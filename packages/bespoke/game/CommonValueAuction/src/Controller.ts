import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from "bespoke-server";
import {ICreateParams, IGameState, IPlayerState, IPushParams, IMoveParams} from "./interface";
import {MoveType, PushType, FetchType} from './config'
import {GameState} from "./interface";
import {NEW_ROUND_TIMER, PlayerStatus} from "./config";

const genRan = ({L, H}) => ~~(Math.random() * (H - L)) + L


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
        const {game: {params: {groupSize, round, positions, mode}}} = this
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
                        rounds: Array(round).fill(null).map<GameState.Group.IRound>((_, i) => ({
                            playerStatus: Array(groupSize).fill(i === 0 ? PlayerStatus.outside : PlayerStatus.prepared)
                        }))
                    }
                    groupIndex = gameState.groups.push(group) - 1
                }
                playerState.groupIndex = groupIndex
                playerState.positionIndex = gameState.groups[groupIndex].playerNum++
                playerState.privatePrices = positions[playerState.positionIndex].privatePrice
                break
            case MoveType.enterMarket: {
                const {groupIndex, positionIndex} = playerState,
                    {rounds, roundIndex} = gameState.groups[groupIndex]
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
                if (playerStatus.every(status => status === PlayerStatus.shouted)) {
                    switch (mode) {
                        case 0: {
                            const highestSorts = groupPlayerStates.sort((a, b) => b.prices[roundIndex] - a.prices[roundIndex])
                            const winnersPosition = highestSorts.map((p, i) => {
                                if (p.prices[roundIndex] === highestSorts[0].prices[roundIndex]) {
                                    return i
                                }
                            }).filter(a => a !== undefined)
                            const winner = winnersPosition[genRan({L: 0, H: winnersPosition.length})]
                            highestSorts[winner].profits[roundIndex] = highestSorts[winner].privatePrices[roundIndex] - highestSorts[winner].prices[roundIndex]
                            break
                        }
                        case 1: {
                            const secondHighestSorts = groupPlayerStates.sort((a, b) => b.prices[roundIndex] - a.prices[roundIndex])
                            secondHighestSorts[1].profits[roundIndex] = secondHighestSorts[1].privatePrices[roundIndex] - secondHighestSorts[1].prices[roundIndex]
                            break
                        }
                        case 2: {
                            const avg = groupPlayerStates.map(p => p.prices[roundIndex]).reduce((pre, cur) => cur += pre) / groupPlayerStates.length
                            let avgWinnerPosition = -1, avgBest = Number.MAX_VALUE
                            groupPlayerStates.map((p, i) => {
                                if (p.prices[roundIndex] - avg < avgBest) {
                                    avgWinnerPosition = i
                                }
                            })
                            groupPlayerStates[avgWinnerPosition].profits[roundIndex] = groupPlayerStates[avgWinnerPosition].privatePrices[roundIndex] -
                                groupPlayerStates[avgWinnerPosition].prices[roundIndex]
                            break
                        }
                        case 3: {
                            const prices = groupPlayerStates.map(p => p.prices[roundIndex])
                            const median = (prices[(prices.length - 1) >> 1] + prices[prices.length >> 1]) / 2
                            let medianWinnerPosition = -1, medianBest = Number.MAX_VALUE
                            groupPlayerStates.map((p, i) => {
                                if (p.prices[roundIndex] - median < medianBest) {
                                    medianWinnerPosition = i
                                }
                            })
                            groupPlayerStates[medianWinnerPosition].profits[roundIndex] = groupPlayerStates[medianWinnerPosition].privatePrices[roundIndex] -
                                groupPlayerStates[medianWinnerPosition].prices[roundIndex]
                            break
                        }
                        default:
                            break
                    }
                    groupPlayerStates.map(p => p.profits[roundIndex] = p.privatePrices[roundIndex] - p.prices[roundIndex])
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
                            return
                        }
                        global.clearInterval(newRoundInterval)
                        groupState.roundIndex++
                        await this.stateManager.syncState()
                    }, 1000)
                }
            }
        }
    }
}
