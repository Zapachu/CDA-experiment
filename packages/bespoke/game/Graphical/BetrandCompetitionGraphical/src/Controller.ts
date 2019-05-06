import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from 'bespoke-server'
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
        const {game: {params: {groupSize, round}}} = this
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
                            playerPrice: Array(groupSize).fill(null),
                            dealerIndex: null
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
                if(params.price > 100 || params.price <= 0) {
                    return
                }
                const {groupIndex, positionIndex} = playerState,
                    groupState = gameState.groups[groupIndex],
                    {rounds, roundIndex} = groupState,
                    {playerStatus, playerPrice} = rounds[roundIndex],
                    groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)
                if(playerStatus[positionIndex] === PlayerStatus.shouted) {
                    return
                }
                playerStatus[positionIndex] = PlayerStatus.shouted
                playerState.prices[roundIndex] = params.price
                if (playerStatus.every(status => status === PlayerStatus.shouted)) {
                    setTimeout(async () => {
                        const [player] = groupPlayerStates.sort((s1, s2) => s1.prices[roundIndex] - s2.prices[roundIndex])
                        const strikePrice = player.prices[roundIndex]
                        groupPlayerStates.forEach(ps => {
                            playerPrice[ps.positionIndex] = ps.prices[roundIndex]
                        })
                        const potentialDealers = groupPlayerStates.filter(ps => ps.prices[roundIndex] === strikePrice)
                        const randomIndex = Math.floor(Math.random() * potentialDealers.length)
                        const dealer = potentialDealers[randomIndex]
                        dealer.profits[roundIndex] = strikePrice
                        rounds[roundIndex].dealerIndex = dealer.positionIndex
                        await this.stateManager.syncState()
                    }, 2000)
                }
            }
        }
    }
}
