import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from '@bespoke/core'
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import {DEAL_TIMER, MoveType, NEW_ROUND_TIMER, PlayerStatus, PushType} from './config'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.groups = []
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const {game: {params: {round}}} = this
        const playerState = await super.initPlayerState(actor)
        playerState.quantities = Array(round).fill(null)
        playerState.profits = Array(round).fill(0)
        return playerState
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {game: {params: {groupSize, round, quota}}} = this
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
                    const group: GameState.IGroup = {
                        roundIndex: 0,
                        playerNum: 0,
                        rounds: Array(round).fill(null).map<GameState.Group.IRound>((_, i) => ({
                            playerStatus: Array(groupSize).fill(PlayerStatus.outside),
                            unitPrices: []
                        })),
                    }
                    groupIndex = gameState.groups.push(group) - 1
                }
                playerState.groupIndex = groupIndex
                playerState.positionIndex = gameState.groups[groupIndex].playerNum++
                break
            }
            case MoveType.enterMarket: {
                const {groupIndex, positionIndex} = playerState,
                    {rounds, roundIndex} = gameState.groups[groupIndex]
                rounds[roundIndex].playerStatus[positionIndex] = PlayerStatus.prepared
                break
            }
            case MoveType.nextRound: {
                const {groupIndex, positionIndex} = playerState,
                    groupState = gameState.groups[groupIndex],
                    {rounds, roundIndex} = groupState,
                    {playerStatus} = rounds[roundIndex],
                    groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)
                rounds[roundIndex].playerStatus[positionIndex] = PlayerStatus.next
                if(playerStatus.every(status => status === PlayerStatus.next)) {
                    if (roundIndex == rounds.length - 1) {
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
                }
                break
            }
            case MoveType.shout: {
                if(params.quantity > quota || params.quantity < 0) {
                    return
                }
                const {groupIndex, positionIndex} = playerState,
                    groupState = gameState.groups[groupIndex],
                    {rounds, roundIndex} = groupState,
                    {playerStatus, unitPrices} = rounds[roundIndex],
                    groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)
                if(playerStatus[positionIndex] === PlayerStatus.shouted) {
                    return
                }
                playerStatus[positionIndex] = PlayerStatus.shouted
                playerState.quantities[roundIndex] = params.quantity
                if (playerStatus.every(status => status === PlayerStatus.shouted)) {
                    setTimeout(async () => {
                        const [playerA, playerB] = groupPlayerStates
                        const unitPrice = quota - (playerA.quantities[roundIndex] + playerB.quantities[roundIndex])
                        unitPrices[roundIndex] = unitPrice
                        playerA.profits[roundIndex] = playerA.quantities[roundIndex] * unitPrice
                        playerB.profits[roundIndex] = playerB.quantities[roundIndex] * unitPrice
                        await this.stateManager.syncState()
                        
                    }, 2000)
                }
            }
        }
    }
}
