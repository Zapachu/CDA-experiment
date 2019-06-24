import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from 'bespoke-server'
import {
    Config,
    GameScene,
    ICreateParams,
    IGameRoundState,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
    PushType,
    Role
} from './config'

const {ROUND, PLAYER_NUM, PREPARE_TIME, RESULT_TIME, TRADE_TIME} = Config

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.playerIndex = 0
        gameState.scene = GameScene.prepare
        gameState.rounds = Array(ROUND).fill(null).map<IGameRoundState>(() => ({time: 0, shouts: [], trades: []}))
        gameState.prepareTime = 0
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        playerState.profits = []
        return playerState
    }

    async startPrepareCountDown() {
        const gameState = await this.stateManager.getGameState()
        gameState.prepareTime++
        const timer = global.setInterval(async () => {
            if (++gameState.prepareTime === PREPARE_TIME) {
                global.clearInterval(timer)
                gameState.scene = GameScene.trade
                Array(PLAYER_NUM - gameState.playerIndex).fill(null).forEach(async (_, i) => {
                    await this.startRobot(i)
                })
                await this.startRoundCountDown(0)
            }
            await this.stateManager.syncState()
        }, 1E3)
    }

    async startRoundCountDown(round: number) {
        const gameState = await this.stateManager.getGameState()
        gameState.roundIndex = round
        const timer = global.setInterval(async () => {
            const time = ++gameState.rounds[round].time
            if (time === ~~(TRADE_TIME>>2)) {
                this.broadcast(PushType.beginRound ,{round})
            }
            if (time === TRADE_TIME + RESULT_TIME) {
                global.clearInterval(timer)
                if (round < ROUND - 1) {
                    await this.startRoundCountDown(round + 1)
                } else {
                    gameState.scene = GameScene.result
                }
            }
            await this.stateManager.syncState()
        }, 1E3)
    }

    async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor)
        switch (type) {
            case MoveType.getIndex: {
                if ((playerState.index !== undefined) || (gameState.playerIndex >= PLAYER_NUM)) {
                    break
                }
                playerState.index = gameState.playerIndex++
                playerState.role = playerState.index % 2 ? Role.buyer : Role.seller
                playerState.privatePrices = Array(ROUND).fill(null).map(() => ~~(Math.random() * 20 * (playerState.role === Role.seller ? -1 : 1) + 70))
                if (playerState.index === 0) {
                    await this.startPrepareCountDown()
                }
                break
            }
            case MoveType.shout: {
                const {shouts, trades} = gameState.rounds[gameState.roundIndex]
                let myShout = shouts[playerState.index]
                if (myShout && myShout.traded) {
                    break
                }
                myShout = {
                    price: params.price,
                    role: playerState.role
                }
                shouts[playerState.index] = myShout
                const pairShoutIndex = shouts.findIndex(shout => {
                    if (!shout || (shout.role === myShout.role) || shout.traded) {
                        return false
                    }
                    return myShout.role === Role.seller ? shout.price >= myShout.price : shout.price <= myShout.price
                })
                if (pairShoutIndex === -1) {
                    break
                }
                myShout.traded = true
                shouts[pairShoutIndex].traded = true
                trades.push({
                    reqIndex: pairShoutIndex,
                    resIndex: playerState.index,
                    price: shouts[pairShoutIndex].price
                })
                break
            }
        }
    }
}

