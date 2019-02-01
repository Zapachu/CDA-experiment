import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from 'server-vendor'
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import {DEAL_TIMER, FetchType, MoveType, NEW_ROUND_TIMER, PlayerStatus, PushType} from './config'

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
        const {game: {params: {groupSize, round, privatePrice, startingPrice}}} = this
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
                            playerStatus: Array(groupSize).fill(i === 0 ? PlayerStatus.outside : PlayerStatus.prepared)
                        }))
                    }
                    groupIndex = gameState.groups.push(group) - 1
                }
                playerState.groupIndex = groupIndex
                playerState.positionIndex = gameState.groups[groupIndex].playerNum++
                playerState.privatePrices = privatePrice.map(v => +v.split(',')[playerState.positionIndex])
                break
            }
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
                    let dealTimer = 1
                    const dealInterval = global.setInterval(async () => {
                        groupPlayerStates.forEach(({actor}) => this.push(actor, PushType.dealTimer, {
                            roundIndex,
                            dealTimer
                        }))
                        if (dealTimer++ < DEAL_TIMER) {
                            return
                        }
                        global.clearInterval(dealInterval)
                        const [{positionIndex}, {prices}] = groupPlayerStates.sort((s1, s2) => s2.prices[roundIndex] - s1.prices[roundIndex])
                        playerStatus[positionIndex] = PlayerStatus.won
                        playerState.profits[roundIndex] = prices[roundIndex] - startingPrice
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
                    }, 1000)
                }
            }
        }
    }
}