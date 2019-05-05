import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from 'bespoke-server'
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import {MATCH_TIMER, FetchType, MoveType, PlayerStatus, PushType, IPOType} from './config'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.groups = []
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const {game: {params: {privateMax, privateMin}}} = this
        const playerState = await super.initPlayerState(actor)
        playerState.privateValue = this.genRandomInt(privateMin, privateMax)
        playerState.playerStatus = PlayerStatus.matching
        playerState.actualNum = 0;
        playerState.profit = 0;
        return playerState
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {game: {params: {groupSize, startingBalance}}} = this
        const playerState = await this.stateManager.getPlayerState(actor),
            gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates()
        switch (type) {
            case MoveType.getPosition: {
                if (playerState.groupIndex !== undefined) {
                    break
                }
                global.setTimeout(() => {
                    let matchTimer = 1
                    const newRoundInterval = global.setInterval(async () => {
                        this.push(playerState.actor, PushType.matchTimer, {matchTimer})
                        if(gameState.groups[playerState.groupIndex].playerNum === groupSize) {
                            this.push(playerState.actor, PushType.matchMsg, {matchMsg: '匹配成功'})
                            const groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === playerState.groupIndex)
                            groupPlayerStates.forEach(s => s.playerStatus = PlayerStatus.prepared);
                            global.clearInterval(newRoundInterval)
                            await this.stateManager.syncState()
                            return;
                        }
                        if (matchTimer++ < MATCH_TIMER) {
                            return
                        }
                        global.clearInterval(newRoundInterval)
                        await this.activateRobots(playerState)
                        await this.stateManager.syncState()
                    }, 1000)
                }, 0)
                let groupIndex = gameState.groups.findIndex(({playerNum}) => playerNum < groupSize)
                if (groupIndex === -1) {
                    const group: GameState.IGroup = {
                        playerNum: 0,
                    }
                    groupIndex = gameState.groups.push(group) - 1
                }
                playerState.groupIndex = groupIndex
                playerState.positionIndex = gameState.groups[groupIndex].playerNum++
                break
            }
            case MoveType.startSinglePlayer: {
                await this.activateRobots(playerState)
                break
            }
            case MoveType.shout: {
                if(params.num <= 0 || params.price <= 0 || params.price * params.num > startingBalance) {
                    return
                }
                const {groupIndex, playerStatus} = playerState,
                    groupState = gameState.groups[groupIndex],
                    groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)
                if(playerStatus === PlayerStatus.shouted) {
                    return
                }
                playerState.playerStatus = PlayerStatus.shouted
                playerState.price = params.price
                playerState.bidNum = params.num
                if (groupPlayerStates.every(s => s.playerStatus === PlayerStatus.shouted)) {
                    setTimeout(async () => {
                        this.processProfits(groupState, groupPlayerStates);
                        groupPlayerStates.forEach(s => s.playerStatus = PlayerStatus.result);
                        await this.stateManager.syncState()
                    }, 2000)
                }
            }
        }
    }

    //todo 股票数量不够的情况
    processProfits(groupSate: GameState.IGroup, groupPlayerStates: Array<TPlayerState<IPlayerState>>) {
        const {total, type} = this.game.params;
        const numberOfShares = groupPlayerStates.reduce((acc, item) => acc+item.bidNum, 0);
        const sortedPlayerStates = groupPlayerStates.sort((a, b) => b.price - a.price);
        if(type === IPOType.Median) {
            const buyers = [];
            const buyerLimits = [];
            const median = Math.floor(numberOfShares / 2);
            let leftNum = median;
            let strikePrice;
            let buyerTotal = 0;
            for(let i=0; i<sortedPlayerStates.length; i++) {
                const curPlayer = sortedPlayerStates[i];
                buyerTotal += curPlayer.bidNum;
                buyers.push(curPlayer);
                buyerLimits.push(curPlayer.bidNum + median - leftNum);
                if(curPlayer.bidNum >= leftNum) {
                    strikePrice = curPlayer.price;
                    break;
                }
                leftNum -= curPlayer.bidNum;
            }
            let count = 0;
            while(count++ < total) {
                const random = this.genRandomInt(1, buyerTotal);
                const buyerIndex = this.findBuyerIndex(random, buyerLimits);
                buyers[buyerIndex].actualNum++;
            }
            buyers.forEach(s => {
                s.profit = (s.privateValue - strikePrice) * s.actualNum;
            })
            groupSate.strikePrice = strikePrice;
        }
        if(type === IPOType.TopK) {
            const buyers = [];
            let leftNum = total;
            let strikePrice;
            for(let i=0; i<sortedPlayerStates.length; i++) {
                const curPlayer = sortedPlayerStates[i];
                curPlayer.actualNum = curPlayer.bidNum > leftNum ? leftNum : curPlayer.bidNum;
                buyers.push(curPlayer);
                if(curPlayer.bidNum >= leftNum) {
                    strikePrice = curPlayer.price;
                    break;
                }
                leftNum -= curPlayer.bidNum;
            }
            buyers.forEach(s => {
                s.profit = (s.privateValue - strikePrice) * s.actualNum;
            })
            groupSate.strikePrice = strikePrice;
        }
    }

    findBuyerIndex(num: number, array: Array<number>): number {
        let lo = 0;
        let hi = array.length - 1;
        while(lo < hi) {
            const mid = Math.floor((hi - lo)/2 + lo);
            if(array[mid] === num) {
                return mid;
            }
            else if(num > array[mid]) {
                lo = mid + 1;
            }
            else {
                if(mid === 0 || num > array[mid - 1]) {
                    return mid;
                }
                hi = mid - 1;
            }
        }
        return lo;
    }

    genRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    async activateRobots(playerState: TPlayerState<IPlayerState>) {
        const {game: {params: {groupSize}}} = this
        const gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates()
        const groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === playerState.groupIndex)
        const robotNum = groupSize - groupPlayerStates.length;
        if(robotNum === 0) {
            this.push(playerState.actor, PushType.matchMsg, {matchMsg: '匹配成功'})
            groupPlayerStates.forEach(s => s.playerStatus = PlayerStatus.prepared);
            return;
        }
        gameState.groups[playerState.groupIndex].playerNum = groupSize;
        global.setTimeout(async () => {
            const asyncInitRobots = Array(robotNum).fill('').map(async (_, i) => await this.startNewRobotScheduler(`Robot_${i}`, false))
            await Promise.all(asyncInitRobots);
            this.broadcast(PushType.robotShout);
            groupPlayerStates.forEach(s => {
                this.push(s.actor, PushType.matchMsg, {matchMsg: `系统加入了${robotNum}个算法交易者`})
                s.playerStatus = PlayerStatus.prepared
            });
            await this.stateManager.syncState()
        }, 0)
    }
}
