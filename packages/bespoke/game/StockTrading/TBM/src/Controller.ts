import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from "bespoke-server";
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from "./interface";
import {FetchType, MoveType, NEW_ROUND_TIMER, PlayerStatus, PushType} from './config'
import {STOCKS} from "../../components/constants";
import {genRandomInt} from "../../IPO/src/Controller";
import {SHOUT_TIMER} from "../../IPO/src/config";
import {IGameGroupState} from "../../CBM/src/config";

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
        if (group.isMulti) {
            playerState.multi = {groupIndex}
        } else {
            playerState.single = {groupIndex, rounds: [{}]}
        }
        playerState.playerStatus = PlayerStatus.matching
    }

    async initRobots(groupIndex: number, amount: number) {
        for (let i = 0; i < amount; i++) {
            await this.startNewRobotScheduler(`Robot_G${groupIndex}_${i}`, false);
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
        const groupIndex = gameState.groups.push(group) - 1;
        this.joinPlayer(playerState, group, groupIndex);
        await this.initRobots(groupIndex, groupSize - 1);
    }

    processProfits(playerStates: Array<IPlayerState>, group: GameState.IGroup) {
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
        groupPlayerStates.map(p => p.profits[roundIndex] = p.privatePrices[roundIndex] - p.prices[roundIndex])
    }

    autoProcessProfits(group: GameState.IGroup, groupPlayerStates: Array<TPlayerState<IPlayerState>>, groupIndex: number) {
        const investorStates = groupPlayerStates.filter(s => {
            if (s.playerStatus === PlayerStatus.prepared) {
                s.multi.price = 0
                s.multi.bidNum = 0
                s.multi.profit = 0
                return false
            }
            return true
        }).map(s => s)
        this.processProfits(investorStates as Array<IPlayerState>, group as GameState.IGroup)
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
                this.autoProcessProfits(group, groupPlayerStates, groupIndex)
                await this.stateManager.syncState()
            }, 1000);
        }, 0);
    }

    initState(group: GameState.IGroup, groupPlayerStates: Array<TPlayerState<IPlayerState>>) {
        const {roundIndex, isMulti, rounds} = group
        let gameRound = rounds[roundIndex]
        if (!gameRound) {
            gameRound = rounds[roundIndex] = {}
        }
        if (isMulti) {
            this.startShoutTicking(group, groupPlayerStates[0].multi.groupIndex)
        }
        groupPlayerStates.forEach((s, i) => {
            if (isMulti) {
                s.multi.privateValue = privateValue;
            } else {
                let playerRound = s.single.rounds[roundIndex];
                if (!playerRound) {
                    playerRound = s.single.rounds[roundIndex] = {};
                }
                playerRound.privateValue = privateValue;
                playerRound.startingPrice = startingPrice;
            }
            s.playerStatus = PlayerStatus.prepared;
            setTimeout(() => {
                this.push(s.actor, PushType.robotShout, {
                    min: gameRound.min,
                    max: privateValue,
                    startingPrice
                });
            }, 600 * (i + 1));
        });
    }

    startMatchTicking(group: GameState.IGroup, groupIndex: number) {
        const {groupSize, waitingSeconds} = this.game.params
        global.setTimeout(() => {
            const matchIntervals = this.matchIntervals
            let matchTimer = 1;
            matchIntervals[groupIndex] = global.setInterval(async () => {
                const playerStates = await this.stateManager.getPlayerStates()
                const groupPlayerStates = Object.values(playerStates).filter(s => s.multi && s.multi.groupIndex === groupIndex)
                groupPlayerStates.forEach(s => {
                    this.push(s.actor, PushType.matchTimer, {matchTimer, matchNum: groupPlayerStates.length})
                })
                if (group.playerNum === groupSize) {
                    global.clearInterval(matchIntervals[groupIndex])
                    delete matchIntervals[groupIndex]
                    this.initState(group, groupPlayerStates)
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
        const {game: {params: {groupSize, positions, waitingSeconds}}} = this
        const playerState = await this.stateManager.getPlayerState(actor),
            gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates()
        switch (type) {
            case MoveType.startSingle:
                if (playerState.playerStatus !== PlayerStatus.intro) {
                    break
                }
                await this.createGroupAndInitRobot(gameState, playerState)
                break
            case MoveType.startMulti:
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
                    this.startMatchTicking(group, groupIndex)
                }
                this._joinPlayer(playerState, gameState.groups[groupIndex], groupIndex);
                break;
            case MoveType.getPosition:
                if (playerState.groupIndex !== undefined) {
                    break
                }
                // let groupIndex = gameState.groups.findIndex(({playerNum}) => playerNum < groupSize)
                if (groupIndex === -1) {
                    const group: GameState.IGroup = {
                        roundIndex: 0,
                        playerNum: 0,
                        rounds: Array(round).fill(null).map<GameState.Group.IRound>(() => ({
                            playerStatus: Array(groupSize).fill(PlayerStatus.outside)
                        }))
                    }
                    groupIndex = gameState.groups.push(group) - 1
                }

                let addRobotTimer = 1
                const addRobotTask = global.setInterval(async () => {
                    if (addRobotTimer++ < waitingSeconds) {
                        await this.broadcast(PushType.matchingTimer, {addRobotTimer})
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
                playerState.privatePrices = positions[playerState.positionIndex].privatePrice
                break
            case MoveType.prepare: {
                const {groupIndex, positionIndex} = playerState
                const {rounds, roundIndex} = gameState.groups[groupIndex]
                rounds[roundIndex].playerStatus[positionIndex] = PlayerStatus.prepared
                if (rounds[roundIndex].playerStatus.every(s => s === PlayerStatus.prepared)) {
                    for (let i in rounds[roundIndex].playerStatus) rounds[roundIndex].playerStatus[i] = PlayerStatus.startBid
                    this.broadcast(PushType.startBid, {roundIndex})
                }
                break
            }
            case MoveType.nextStage: {
                break;
                // todo connect to other stage
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
                        this.broadcast(PushType.nextRound)
                        await this.stateManager.syncState()
                    }, 1000)
                }
            }
        }
    }
}
