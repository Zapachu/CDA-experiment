import {BaseController, IActor, IGameWithId, IMoveCallback, redisClient, TGameState, TPlayerState} from '../../../core/src/server'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import {FetchType, MoveType, PushType, RedisKey} from './config'
import cloneDeep = require('lodash/cloneDeep')

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.playerSeq = 0
        gameState.broadcastFrames = []
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        playerState.pushFrames = []
        playerState.prices = []
        playerState.profits = this.game.params.privatePrice.map(() => 0)
        playerState.round = 0
        return playerState
    }

    getGame4Player(): IGameWithId<ICreateParams> {
        const game = cloneDeep(this.game)
        game.params.privatePrice = []
        return game
    }

    async geneFrameSeq(): Promise<number> {
        return await redisClient.incr(RedisKey.frameSeq(this.game.id))
    }

    protected async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {game: {params: {privatePrice, groupSize, startingPrice}}} = this
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor)
        switch (type) {
            case MoveType.getPosition: {
                if (playerState.privatePrices === undefined) {
                    const playerSeq = gameState.playerSeq++
                    playerState.groupIndex = ~~(playerSeq / groupSize)
                    playerState.positionIndex = playerSeq % groupSize
                    playerState.privatePrices = privatePrice.map(
                        roundPrivatePrice => +(roundPrivatePrice.split(',')[playerState.positionIndex % groupSize]))
                }
                const {positionIndex, privatePrices} = playerState
                cb(positionIndex, privatePrices)
                break
            }
            case MoveType.enterMarket: {
                this.broadcastInGroup(playerState.groupIndex, PushType.playerEnter, {positionIndex: playerState.positionIndex})
                break
            }
            case MoveType.shout: {
                const {round} = playerState
                playerState.prices[round] = params.price
                this.broadcastInGroup(playerState.groupIndex, PushType.someoneShout, {
                    positionIndex: playerState.positionIndex
                })
                const curGroupPlayerStates = await this.getCurGroupPlayerStates(playerState.groupIndex)
                if (curGroupPlayerStates.length === groupSize && curGroupPlayerStates.every(({prices}) => !!prices[round])) {
                    const [winner, {prices}] = Object.values(curGroupPlayerStates).sort((p1, p2) => p2.prices[round] - p1.prices[round]),
                        tradePrice = prices[round]
                    winner.profits[round] = tradePrice - startingPrice
                    this.broadcastInGroup(playerState.groupIndex, PushType.win, {
                        positionIndex: winner.positionIndex,
                        tradePrice
                    })
                    if (round < this.game.params.round - 1) {
                        setTimeout(() => {
                                curGroupPlayerStates.forEach(playerState => playerState.round++)
                                this.broadcastInGroup(playerState.groupIndex, PushType.newRound, {round: playerState.round})
                            }, 2000
                        )
                    }
                }
            }
        }
    }

    async getCurGroupPlayerStates(groupIndex: number): Promise<Array<TPlayerState<IPlayerState>>> {
        const playerStates = await this.stateManager.getPlayerStates()
        return Object.values(playerStates).filter(playerState => playerState.groupIndex === groupIndex)
    }

    protected broadcastInGroup(groupIndex: number, type: PushType, params?: IPushParams) {
        setTimeout(async () => {
            const curGroupActors = (await this.getCurGroupPlayerStates(groupIndex)).map(({actor}) => actor)
            super.push(curGroupActors, type, params)
            const seq = await this.geneFrameSeq()
            const gameState = await this.stateManager.getGameState()
            gameState.broadcastFrames.push({
                groupIndex,
                seq,
                type,
                params
            })
        })
    }
}