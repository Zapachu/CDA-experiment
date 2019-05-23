import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from "bespoke-server"
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from "./interface"
import {FetchType, MoveType, PlayerStatus, PushType, SHOUT_TIMER} from './config'

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

    private matchIntervals: { [groupIndex: string]: NodeJS.Timer } = {}
    private shoutIntervals: { [groupIndex: string]: NodeJS.Timer } = {}

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.groups = []
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        playerState.playerStatus = PlayerStatus.intro
        return playerState
    }

    joinPlayer(playerState: TPlayerState<IPlayerState>, group: GameState.IGroup, groupIndex: number) {
        const {groupSize} = this.game.params
        if (group.playerNum === groupSize) {
            return
        }
        group.playerNum++
        playerState.positionIndex = group.playerNum
        if (group.isMulti) {
            playerState.multi = {groupIndex}
        } else {
            playerState.single = {groupIndex, rounds: [{}]}
        }
        playerState.playerStatus = PlayerStatus.matching
    }

    async initRobots(groupIndex: number, amount: number) {
        for (let i = 0; i < amount; i++) {
            await this.startNewRobotScheduler(`Robot_G${groupIndex}_${i}`, false)
        }
    }

    async createGroupAndInitRobot(gameState: TGameState<IGameState>, playerState: TPlayerState<IPlayerState>) {
        const {groupSize} = this.game.params
        const group: GameState.IGroup = {
            playerNum: 0,
            roundIndex: 0,
            isMulti: false,
            rounds: [{}]
        };
        const groupIndex = gameState.groups.push(group) - 1
        this.joinPlayer(playerState, group, groupIndex)
        await this.initRobots(groupIndex, groupSize - 1)
    }

    processProfits(playerStates: Array<IPlayerState>, group: GameState.IGroup, groupPlayerStates: Array<TPlayerState<IPlayerState>>) {
        const buyerStates = playerStates.filter(s => s.role === 0).map(s => s)
        const sellerStates = playerStates.filter(s => s.role === 1).map(s => s)
        const intentionG = buyerStates.map(({multi: {price: buyPrice, bidNum: buyBidNum}}) =>
            sellerStates.map(({multi: {price: sellerPrice, bidNum: sellerBidNum}}) =>
                buyBidNum * buyPrice >= sellerBidNum * sellerPrice))
        group.results = []
        getBestMatching(intentionG)
            .forEach(async ([buyerIndex, sellerIndex]) => {
                group.results.push({
                    buyerPosition: buyerStates[buyerIndex].positionIndex,
                    sellerPosition: sellerStates[sellerIndex].positionIndex
                })
            })
        groupPlayerStates.map(p => p.multi.profit = p.multi.privateValue - p.multi.price * p.multi.bidNum)
    }

    autoProcessProfits(group: GameState.IGroup, groupPlayerStates: Array<TPlayerState<IPlayerState>>) {
        const investorStates = groupPlayerStates.filter(s => {
            if (s.playerStatus === PlayerStatus.prepared) {
                s.multi.price = 0
                s.multi.bidNum = 0
                s.multi.profit = 0
                return false
            }
            return true
        }).map(s => s)
        this.processProfits(investorStates as Array<IPlayerState>, group as GameState.IGroup, groupPlayerStates as Array<TPlayerState<IPlayerState>>)
        groupPlayerStates.forEach(s => (s.playerStatus = PlayerStatus.result))
    }

    startShoutTicking(group: GameState.IGroup, groupIndex: number) {
        global.setTimeout(() => {
            const shoutIntervals = this.shoutIntervals
            let shoutTimer = 1
            shoutIntervals[groupIndex] = global.setInterval(async () => {
                const playerStates = await this.stateManager.getPlayerStates()
                const groupPlayerStates = Object.values(playerStates).filter(
                    s => s.multi && s.multi.groupIndex === groupIndex
                )
                groupPlayerStates.forEach(s => {
                    this.push(s.actor, PushType.shoutTimer, {shoutTimer})
                })
                if (groupPlayerStates.every(s => s.playerStatus !== PlayerStatus.prepared)) {
                    global.clearInterval(shoutIntervals[groupIndex])
                    delete shoutIntervals[groupIndex]
                    return
                }
                if (shoutTimer++ < SHOUT_TIMER) {
                    return
                }
                global.clearInterval(shoutIntervals[groupIndex])
                delete shoutIntervals[groupIndex]
                this.autoProcessProfits(group, groupPlayerStates)
                await this.stateManager.syncState()
            }, 1000)
        }, 0)
    }

    initState(group: GameState.IGroup, groupPlayerStates: Array<TPlayerState<IPlayerState>>, positions: Array<IPosition>) {
        const {roundIndex, isMulti} = group
        if (isMulti) {
            this.startShoutTicking(group, groupPlayerStates[0].multi.groupIndex)
        }
        groupPlayerStates.forEach((s, i) => {
            s.role = positions[s.positionIndex].role
            if (isMulti) {
                s.multi.privateValue = positions[s.positionIndex].privatePrice
            } else {
                let playerRound = s.single.rounds[roundIndex]
                if (!playerRound) {
                    playerRound = s.single.rounds[roundIndex] = {}
                }
                playerRound.privateValue = positions[s.positionIndex].privatePrice
            }
            s.playerStatus = PlayerStatus.prepared
            setTimeout(() => {
                this.push(s.actor, PushType.robotShout)
            }, 600 * (i + 1))
        })
    }

    startMatchTicking(group: GameState.IGroup, groupIndex: number) {
        const {groupSize, waitingSeconds, positions} = this.game.params
        global.setTimeout(() => {
            const matchIntervals = this.matchIntervals
            let matchTimer = 1
            matchIntervals[groupIndex] = global.setInterval(async () => {
                const playerStates = await this.stateManager.getPlayerStates()
                const groupPlayerStates = Object.values(playerStates).filter(s => s.multi && s.multi.groupIndex === groupIndex)
                groupPlayerStates.forEach(s => {
                    this.push(s.actor, PushType.matchTimer, {matchTimer, matchNum: groupPlayerStates.length})
                })
                if (group.playerNum === groupSize) {
                    global.clearInterval(matchIntervals[groupIndex])
                    delete matchIntervals[groupIndex]
                    this.initState(group, groupPlayerStates, positions as Array<IPosition>)
                    await this.stateManager.syncState()
                    return
                }
                if (matchTimer++ < waitingSeconds) {
                    return
                }
                global.clearInterval(matchIntervals[groupIndex])
                delete matchIntervals[groupIndex]
                await this.initRobots(groupIndex, groupSize - group.playerNum)
                await this.stateManager.syncState()
            }, 1000)
        }, 0)
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {game: {params: {groupSize, positions}}} = this
        const playerState = await this.stateManager.getPlayerState(actor),
            gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates()
        switch (type) {
            case MoveType.startSingle: {
                if (playerState.playerStatus !== PlayerStatus.intro) {
                    break
                }
                await this.createGroupAndInitRobot(gameState, playerState)
                break
            }
            case MoveType.startMulti: {
                if (playerState.playerStatus !== PlayerStatus.intro) {
                    break
                }
                let groupIndex = gameState.groups.findIndex(({playerNum, isMulti}) => playerNum < groupSize && isMulti)
                if (groupIndex === -1) {
                    const group: GameState.IGroup = {
                        playerNum: 0,
                        roundIndex: 0,
                        isMulti: true,
                        rounds: [{}]
                    }
                    groupIndex = gameState.groups.push(group) - 1
                    playerState.multi = {groupIndex: groupIndex}
                    playerState.positionIndex = gameState.groups[groupIndex].playerNum++
                    playerState.role = positions[playerState.positionIndex].role
                    playerState.multi.privateValue = positions[playerState.positionIndex].privatePrice
                    this.startMatchTicking(group, groupIndex)
                }
                this.joinPlayer(playerState, gameState.groups[groupIndex], groupIndex)
                break
            }
            case MoveType.joinRobot: {
                let groupIndex = gameState.groups.findIndex(({playerNum}) => playerNum < groupSize)
                if (groupIndex === -1) {
                    break
                }
                const group = gameState.groups[groupIndex]
                this.joinPlayer(playerState, group, groupIndex)
                if (group.playerNum === groupSize) {
                    const groupPlayerStates = Object.values(playerStates).filter(s =>
                        group.isMulti ? s.multi && s.multi.groupIndex === groupIndex
                            : s.single && s.single.groupIndex === groupIndex
                    )
                    this.initState(group, groupPlayerStates, positions as Array<IPosition>)
                }
            }
            // case MoveType.prepare: {
            //     const {groupIndex, positionIndex} = playerState
            //     const {rounds, roundIndex} = gameState.groups[groupIndex]
            //     rounds[roundIndex].playerStatus[positionIndex] = PlayerStatus.prepared
            //     if (rounds[roundIndex].playerStatus.every(s => s === PlayerStatus.prepared)) {
            //         for (let i in rounds[roundIndex].playerStatus) rounds[roundIndex].playerStatus[i] = PlayerStatus.startBid
            //         this.broadcast(PushType.startBid, {roundIndex})
            //     }
            //     break
            // }
            case MoveType.nextStage: {
                break
                // todo connect to other stage
            }
            case MoveType.shout: {
                const group = gameState.groups[playerState.single.groupIndex]
                const {roundIndex} = group
                let groupIndex: number
                if (playerState.playerStatus === PlayerStatus.shouted) {
                    break
                }
                if (playerState.single) {
                    groupIndex = playerState.single.groupIndex
                    playerState.playerStatus = PlayerStatus.shouted
                    playerState.single.rounds[roundIndex].price = params.price
                    playerState.single.rounds[roundIndex].bidNum = params.num
                }
                if (playerState.multi) {
                    groupIndex = playerState.multi.groupIndex
                    playerState.playerStatus = PlayerStatus.shouted
                    playerState.multi.price = params.price
                    playerState.multi.bidNum = params.num
                }
                const groupPlayerStates = Object.values(playerStates).filter(s =>
                    group.isMulti ? s.multi && s.multi.groupIndex === groupIndex
                        : s.single && s.single.groupIndex === groupIndex
                )
                if (!groupPlayerStates.every(s => s.playerStatus === PlayerStatus.shouted)) {
                    return
                }
                const investorStates = groupPlayerStates.map(s => group.isMulti ? s.multi : s.single.rounds[group.roundIndex])
                setTimeout(async () => {
                    this.processProfits(
                        investorStates as Array<IPlayerState>,
                        group as GameState.IGroup,
                        groupPlayerStates as Array<TPlayerState<IPlayerState>>
                    )
                    groupPlayerStates.forEach(s => (s.playerStatus = PlayerStatus.result))
                    await this.stateManager.syncState()
                }, 2000)
                break
            }
        }
    }
}


interface IPosition {
    role: number
    privatePrice: number
}
