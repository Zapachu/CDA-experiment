import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from "bespoke-server";
import {ICreateParams, IGameState, IPlayerState, IPushParams, IMoveParams} from "./interface";
import {MoveType, PushType, FetchType, NEW_ROUND_TIMER, PlayerStatus} from './config'
import {GameState} from "./interface";

const getBestMatching = G => {
    const MATCHED = 'matched',
        UNMATCHED = 'unMatched'
    const _dfs = (G, right, left, r) => {
        for (let c = 0; c < G[0].length; c++) {
            if (right[c] !== MATCHED && G[r][c]) {
                right[c] = MATCHED
                if (left[c] === UNMATCHED || _dfs(G, right, left, left[c])) {
                    left[c] = r
                    return true
                }
            }
        }
        return false
    }
    const left = Array(G[0].length).fill(UNMATCHED)
    G.forEach((_, r) => {
        const right = []
        _dfs(G, right, left, r)
    })
    return left.map((linkTo, index) => linkTo === UNMATCHED ? null : [linkTo, index])
        .filter(_ => _)
}

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
        const {game: {params: {groupSize, round, positions}}} = this
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
                playerState.role = positions[playerState.positionIndex].role
                playerState.privatePrices = positions[playerState.positionIndex].privatePrice
                break
            case MoveType.shout: {
                const {groupIndex, positionIndex} = playerState,
                    groupState = gameState.groups[groupIndex],
                    {rounds, roundIndex} = groupState,
                    {playerStatus} = rounds[roundIndex],
                    groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)
                playerStatus[positionIndex] = PlayerStatus.shouted
                playerState.prices[roundIndex] = params.price
                if (playerStatus.every(status => status === PlayerStatus.shouted)) {
                    const buyerStates = groupPlayerStates.filter(s => s.role === 0)
                    const sellerStates = groupPlayerStates.filter(s => s.role === 1)
                    const intentionG = buyerStates.map(({prices: buyPrices}) =>
                        sellerStates.map(({prices: sellerPrices}) =>
                            buyPrices[groupIndex] >= sellerPrices[groupIndex]))
                    groupState.results = []
                    getBestMatching(intentionG)
                        .forEach(async ([buyerIndex, sellerIndex]) => {
                            groupState.results.push({
                                buyerPosition: buyerStates[buyerIndex].positionIndex,
                                sellerPosition: sellerStates[sellerIndex].positionIndex
                            })
                        })
                    groupPlayerStates.map(p => p.profits[roundIndex] = p.privatePrices[roundIndex] - p.prices[roundIndex])
                    await this.stateManager.syncState()
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
            }
        }
    }
}
