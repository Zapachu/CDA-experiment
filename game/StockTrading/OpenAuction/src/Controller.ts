import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from '@bespoke/server'
import {RedisCall, Trial} from '@elf/protocol'
import {Phase, phaseToNamespace} from '@bespoke-game/stock-trading-config'
import {
    ICreateParams,
    IGameRoundState,
    IGameState,
    IMoveParams,
    IPlayerRoundState,
    IPlayerState,
    IPushParams,
    MoveType,
    PlayerStatus,
    PriceRange,
    PushType,
    RobotCfg,
    ROUNDS, SecondsToShowResult,
    SecondsToTrade
} from './config'
import {Number} from './util'

export class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    roundTimers: Array<NodeJS.Timer> = []

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.playerIndex = 0
        gameState.round = 0
        gameState.rounds = Array(ROUNDS).fill(null).map(() => ({
            timer: 0,
            shouts: [],
            startPrice: Number.random(PriceRange.start.min, PriceRange.start.max)
        } as IGameRoundState))
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        playerState.rounds = Array(ROUNDS).fill(null).map((_, i) => ({
            status: i === 0 ? PlayerStatus.guide : PlayerStatus.play,
            privatePrice: Number.random(PriceRange.private.min, PriceRange.private.max)
        } as IPlayerRoundState))
        return playerState
    }

    protected async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor),
            gameRoundState = gameState.rounds[gameState.round],
            playerRoundState = playerState.rounds[gameState.round]
        switch (type) {
            case MoveType.guideDone: {
                playerRoundState.status = PlayerStatus.test
                break
            }
            case MoveType.testDone: {
                if (playerState.index !== undefined) {
                    break
                }
                playerState.index = gameState.playerIndex++
                playerRoundState.status = PlayerStatus.play
                break
            }
            case MoveType.shout: {
                if (playerState.index === 0) {
                    setTimeout(() =>
                            Array(RobotCfg.maxAmount - gameState.playerIndex - 1).fill(null).forEach(async (_, i) => {
                                await this.startRobot(i)
                            }),
                        RobotCfg.startDelay * 1e3
                    )
                }
                gameRoundState.timer = SecondsToTrade
                gameRoundState.shouts[playerState.index] = params.price
                global.clearInterval(this.roundTimers[gameState.round])
                this.roundTimers[gameState.round] = global.setInterval(async () => {
                    gameRoundState.timer--
                    if (gameRoundState.timer <= 0) {
                        gameRoundState.traded = true
                        global.clearInterval(this.roundTimers[gameState.round])
                        if (gameState.round < ROUNDS - 1) {
                            global.setTimeout(async () => {
                                gameState.round++
                                await this.stateManager.syncState()
                            }, SecondsToShowResult * 1e3)
                        }
                    }
                    await this.stateManager.syncState()
                }, 1e3)
                break
            }
            case MoveType.exit: {
                const {onceMore} = params
                const res = await RedisCall.call<Trial.Done.IReq, Trial.Done.IRes>(
                    Trial.Done.name,
                    {
                        userId: playerState.user.id,
                        onceMore,
                        namespace: phaseToNamespace(Phase.OpenAuction)
                    }
                )
                res ? cb(res.lobbyUrl) : null
                break
            }
        }
    }
}