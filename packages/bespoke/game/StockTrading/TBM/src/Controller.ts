import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from "bespoke-server"
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from "./interface"
import {FetchType, MoveType, OUT_TIME, PlayerStatus, PushType} from './config'

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
        const playerState = await super.initPlayerState(actor)
        playerState.price = null
        playerState.profit = 0
        playerState.playerStatus = PlayerStatus.intro
        return playerState
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {game: {params: {groupSize, positions, waitingSeconds}}} = this
        const playerState = await this.stateManager.getPlayerState(actor),
            gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates()
        switch (type) {
            case MoveType.joinRobot: {
                if (playerState.groupIndex !== undefined) {
                    break
                }
                let groupIndex = gameState.groups.findIndex(({playerNum}) => playerNum < groupSize)
                if (groupIndex === -1) {
                    const group: GameState.IGroup = {
                        roundIndex: 0,
                        playerNum: 0,
                    }
                    groupIndex = gameState.groups.push(group) - 1
                }
                playerState.groupIndex = groupIndex
                playerState.positionIndex = gameState.groups[groupIndex].playerNum++
                playerState.role = positions[playerState.positionIndex].role
                playerState.privatePrice = positions[playerState.positionIndex].privatePrice
                playerState.playerStatus = PlayerStatus.matching
                const groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)
                if (groupPlayerStates.length === groupSize && groupPlayerStates.every(p => p.playerStatus === PlayerStatus.matching)) {
                    groupPlayerStates.map((p, i) => {
                        p.playerStatus = PlayerStatus.prepared
                        setTimeout(() => {
                            this.push(p.actor, PushType.startBid, {
                                role: p.role,
                                privatePrice: p.privatePrice,
                            })
                        }, 1000 * i)
                    })
                }
                break
            }
            case MoveType.startSingle: {
                if (playerState.groupIndex !== undefined) {
                    break
                }
                let groupIndex = gameState.groups.findIndex(({playerNum}) => playerNum < groupSize)
                if (groupIndex === -1) {
                    const group: GameState.IGroup = {
                        roundIndex: 0,
                        playerNum: 0,
                    }
                    groupIndex = gameState.groups.push(group) - 1
                }

                if (gameState.groups[groupIndex].playerNum < groupSize) {
                    for (let num = 0; num < groupSize - 1; num++) {
                        await this.startNewRobotScheduler(`Robot_${num}`, false)
                    }
                }
                playerState.groupIndex = groupIndex
                playerState.positionIndex = gameState.groups[groupIndex].playerNum++
                playerState.role = positions[playerState.positionIndex].role
                playerState.privatePrice = positions[playerState.positionIndex].privatePrice
                playerState.playerStatus = PlayerStatus.matching
                const groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)
                if (groupPlayerStates.length === groupSize && groupPlayerStates.every(p => p.playerStatus === PlayerStatus.matching)) {
                    groupPlayerStates.map((p, i) => {
                        p.playerStatus = PlayerStatus.prepared
                        setTimeout(() => {
                            this.push(p.actor, PushType.startBid, {
                                role: p.role,
                                privatePrice: p.privatePrice,
                            })
                        }, 1000 * i)
                    })
                }
                break
            }
            case MoveType.startMulti: {
                if (playerState.groupIndex !== undefined) {
                    break
                }
                let groupIndex = gameState.groups.findIndex(({playerNum}) => playerNum < groupSize)
                if (groupIndex === -1) {
                    const group: GameState.IGroup = {
                        roundIndex: 0,
                        playerNum: 0,
                    }
                    groupIndex = gameState.groups.push(group) - 1
                }

                let addRobotTimer = 1
                const addRobotTask = global.setInterval(async () => {
                    const {groupIndex} = playerState
                    if (addRobotTimer++ < waitingSeconds + OUT_TIME) {
                        this.push(playerState.actor, PushType.matchTimer, {
                            matchTimer: addRobotTimer,
                            matchNum: gameState.groups[groupIndex].playerNum
                        })
                        return
                    }
                    global.clearInterval(addRobotTask)
                    if (gameState.groups[groupIndex].playerNum < groupSize) {
                        for (let num = 0; num < groupSize - gameState.groups[groupIndex].playerNum; num++) {
                            await this.startNewRobotScheduler(`Robot_${num}`, false)
                        }
                    }
                }, 1000)
                playerState.groupIndex = groupIndex
                playerState.positionIndex = gameState.groups[groupIndex].playerNum++
                playerState.role = positions[playerState.positionIndex].role
                playerState.privatePrice = positions[playerState.positionIndex].privatePrice
                playerState.playerStatus = PlayerStatus.matching

                const groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)
                if (groupPlayerStates.length === groupSize && groupPlayerStates.every(p => p.playerStatus === PlayerStatus.matching)) {
                    groupPlayerStates.map((p, i) => {
                        p.playerStatus = PlayerStatus.prepared
                        setTimeout(() => {
                            this.push(p.actor, PushType.startBid, {
                                role: p.role,
                                privatePrice: p.privatePrice,
                            })
                        }, 1000 * i)
                    })
                }
                break
            }
            case MoveType.nextStage: {
                break;
                // todo connect to other stage
            }
            case MoveType.shout: {
                const {groupIndex} = playerState,
                    groupState = gameState.groups[groupIndex],
                    groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)
                playerState.playerStatus = PlayerStatus.shouted
                playerState.price = params.price
                playerState.bidNum = params.num
                if (groupPlayerStates.length === groupSize && groupPlayerStates.every(p => p.playerStatus === PlayerStatus.shouted)) {
                    const buyerStates = groupPlayerStates.filter(s => s.role === 0)
                    const sellerStates = groupPlayerStates.filter(s => s.role === 1)
                    const intentionG = buyerStates.map(({price: buyPrice, bidNum: buyNum}) =>
                        sellerStates.map(({price: sellerPrice, bidNum: sellNum}) =>
                            buyPrice * buyNum >= sellerPrice * sellNum))
                    groupState.results = []
                    getBestMatching(intentionG)
                        .forEach(async ([buyerIndex, sellerIndex]) => {
                            groupState.results.push({
                                buyerPosition: buyerStates[buyerIndex].positionIndex,
                                sellerPosition: sellerStates[sellerIndex].positionIndex
                            })
                        })
                    groupPlayerStates.map(p => {
                        p.profit = p.privatePrice - p.price * p.bidNum
                        p.playerStatus = PlayerStatus.result
                    })
                    await this.stateManager.syncState()
                    return
                }
            }
        }
    }
}
