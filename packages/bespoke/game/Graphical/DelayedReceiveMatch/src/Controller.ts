import {BaseController, IActor, IMoveCallback, TGameState, IGameWithId} from 'bespoke-server'
import {ICreateParams, IGameState, IPlayerState, IPushParams, IMoveParams, GameState} from './interface'
import {MoveType, PushType, PlayerStatus, DEAL_TIMER, NEW_ROUND_TIMER} from './config'
import cloneDeep = require('lodash/cloneDeep')

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.groups = []
        return gameState
    }

    getGame4Player(): IGameWithId<ICreateParams> {
        const game = cloneDeep(this.game)
        game.params.groupPPs = []
        return game
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {game: {params: {group, groupSize, round, groupPPs}}} = this
        const playerState = await this.stateManager.getPlayerState(actor),
            gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates()
        switch (type) {
            case MoveType.getPosition: {
                if (playerState.groupIndex !== undefined) {
                    break
                }
                let groupIndex = gameState.groups.findIndex(({playerNum}) => playerNum < groupSize)
                if (groupIndex === -1) {
                    const newGroup: GameState.IGroup = {
                        roundIndex: 0,
                        playerNum: 0,
                        rounds: Array(round).fill(null).map<GameState.Group.IRound>((_, i) => ({
                            playerStatus: Array(groupSize).fill(i === 0 ? PlayerStatus.outside : PlayerStatus.prepared),
                            matchResults: []
                        }))
                    }
                    if (gameState.groups.length >= group) {
                        break
                    }
                    groupIndex = gameState.groups.push(newGroup) - 1
                }
                playerState.groupIndex = groupIndex
                playerState.positionIndex = gameState.groups[groupIndex].playerNum++
                playerState.rounds = groupPPs[groupIndex].roundPPs.map(
                    ({playerPPs}) => {
                        const {privatePrices} = playerPPs[playerState.positionIndex]
                        return {privatePrices}
                    }
                )
                break
            }
            case MoveType.enterMarket: {
                const {groupIndex, positionIndex} = playerState,
                    {rounds, roundIndex} = gameState.groups[groupIndex]
                rounds[roundIndex].playerStatus[positionIndex] = PlayerStatus.prepared
                break
            }
            case MoveType.submit: {
                const {groups} = gameState
                const {groupIndex, positionIndex, rounds: playerRounds} = playerState,
                    groupState = gameState.groups[groupIndex],
                    {roundIndex, rounds: groupRounds} = groups[groupIndex],
                    {playerStatus} = groupRounds[roundIndex],
                    groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)
                playerStatus[positionIndex] = PlayerStatus.submitted
                playerRounds[roundIndex].preferences = params.preferences
                playerRounds[roundIndex].submitTime = new Date().getTime()
                if (playerStatus.every(status => status === PlayerStatus.submitted)) {
                    setTimeout(async () => {
                        groupRounds[roundIndex].playerStatus = playerStatus.map(() => PlayerStatus.matched)
                        const {matchResults} = groupRounds[roundIndex]
                        groupPlayerStates.map(({rounds}) => rounds[roundIndex])
                            .sort(({submitTime: t1}, {submitTime: t2}) => t2 - t1)
                            .forEach(({preferences, privatePrices}) => {
                                const preferIndex = preferences.findIndex(i => matchResults.every(({index}) => i !== index)),
                                    index = preferences[preferIndex]
                                matchResults.push({
                                    index,
                                    price: privatePrices[preferIndex]
                                })
                            })
                        await this.stateManager.syncState()
                        if (roundIndex == this.game.params.round - 1) {
                            return
                        }
                        global.setTimeout(() => {
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
                        }, DEAL_TIMER * 1000)
                    }, 2000)
                }
            }
        }
    }
}
