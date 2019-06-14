import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from 'bespoke-server'

//region
const ROUND = 3,
    PREPARE_TIME = 5,
    TRADE_TIME = 20,
    RESULT_TIME = 5

enum GameScene {
    prepare,
    trade,
    result
}

enum Role {
    seller,
    buyer
}

enum MoveType {
    getIndex = 'getIndex'
}

enum PushType {
}

interface ICreateParams {
}

interface IMoveParams {
    price: number
}

interface IPushParams {
}

interface IGameState {
    prepareTime: number
    roundIndex: number
    rounds: IGameRoundState[]
    playerIndex: number
    scene: GameScene
}

interface IGameRoundState {
    time: number
    prices: []
}

interface IPlayerState {
    role: Role
    privatePrices: number[]
    index: number
    profits: number[]
}

//endregion

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.playerIndex = 0
        gameState.scene = GameScene.prepare
        gameState.rounds = Array(ROUND).fill(null).map<IGameRoundState>(() => ({time: 0, prices: []}))
        gameState.prepareTime = 0
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        playerState.role = Math.random() > .5 ? Role.buyer : Role.seller
        playerState.privatePrices = Array(ROUND).fill(null).map(() => ~~(Math.random() * 20 + 70))
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
                await this.startRoundCountDown(0)
            }
            await this.stateManager.syncState()
        }, 1E3)
    }

    async startRoundCountDown(round: number) {
        const gameState = await this.stateManager.getGameState()
        gameState.roundIndex = round
        const timer = global.setInterval(async () => {
            if (++gameState.rounds[round].time === TRADE_TIME + RESULT_TIME) {
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
                if (playerState.index !== undefined) {
                    break
                }
                playerState.index = gameState.playerIndex++
                if (playerState.index === 0) {
                    await this.startPrepareCountDown()
                }
            }
        }
    }
}

