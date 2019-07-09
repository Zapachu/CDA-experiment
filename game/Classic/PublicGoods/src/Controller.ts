import {BaseController, IActor, IGameWithId, IMoveCallback, TGameState} from '@bespoke/server'
import {
    ICreateParams,
    IGameState,
    IGroupRoundState,
    IGroupState,
    IMoveParams,
    IPlayerState,
    IPushParams
} from './interface'
import {MoveType, NEW_ROUND_TIMER, PlayerStatus, PushType} from './config'
import cloneDeep = require('lodash/cloneDeep')

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.groups = []
        gameState.logs = []
        return gameState
    }

    getGame4Player(): IGameWithId<ICreateParams> {
        const game = cloneDeep(this.game)
        game.params.groupParams = []
        return game
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {game: {params: {group, groupSize, round, groupParams}}} = this
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
                    const newGroup: IGroupState = {
                        roundIndex: 0,
                        playerNum: 0,
                        rounds: Array(round).fill(null).map<IGroupRoundState>((_, i) => ({
                            playerStatus: Array(groupSize).fill(PlayerStatus.prepared)
                        }))
                    }
                    if (gameState.groups.length >= group) {
                        break
                    }
                    groupIndex = gameState.groups.push(newGroup) - 1
                }
                playerState.groupIndex = groupIndex
                playerState.positionIndex = gameState.groups[groupIndex].playerNum++
                playerState.rounds = groupParams[groupIndex].roundParams
                    .map(({playerInitialMoney}) => ({initialMoney: playerInitialMoney[playerState.positionIndex]}))
                break
            }
            case MoveType.submit: {
                const {groups} = gameState
                const {groupIndex, positionIndex, rounds: playerRounds} = playerState,
                    groupState = gameState.groups[groupIndex],
                    {roundIndex, rounds: groupRounds} = groups[groupIndex],
                    groupRoundState = groupRounds[roundIndex],
                    {playerStatus} = groupRoundState,
                    groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)
                playerStatus[positionIndex] = PlayerStatus.submitted
                playerRounds[roundIndex].submitMoney = params.money
                gameState.logs.push([groupIndex, roundIndex, positionIndex, params.money, new Date().getTime()])
                if (playerStatus.every(status => status === PlayerStatus.submitted)) {
                    setTimeout(async () => {
                        groupRounds[roundIndex].playerStatus = playerStatus.map(() => PlayerStatus.result)
                        groupRoundState.returnMoney = ~~((groupPlayerStates.map(({rounds}) => rounds[roundIndex].submitMoney).reduce((m, n) => m + n, 0)) / groupPlayerStates.length)
                        await this.stateManager.syncState()
                        if (roundIndex == this.game.params.round - 1) {
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
                    }, 2000)
                }
            }
        }
    }
}
