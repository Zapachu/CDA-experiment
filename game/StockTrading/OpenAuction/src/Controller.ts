import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from '@bespoke/server'
import {RedisCall, Trial} from '@elf/protocol'
import {Phase, phaseToNamespace} from '@bespoke-game/stock-trading-config'
import {
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
    PlayerStatus,
    PriceRange,
    PushType,
    RobotCfg
} from './config'
import {Number} from './util'

export class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    timer: NodeJS.Timer

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.timer = 0
        gameState.shouts = []
        gameState.playerIndex = 0
        gameState.startPrice = Number.random(PriceRange.start.min, PriceRange.start.max)
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        playerState.status = PlayerStatus.guide
        playerState.privatePrice = Number.random(PriceRange.private.min, PriceRange.private.max)
        return playerState
    }

    protected async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor),
            playerStates = await this.stateManager.getPlayerStates()
        switch (type) {
            case MoveType.guideDone: {
                playerState.status = PlayerStatus.test
                break
            }
            case MoveType.testDone: {
                if (playerState.index !== undefined) {
                    break
                }
                playerState.index = gameState.playerIndex++
                playerState.status = PlayerStatus.play
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
                gameState.timer = 30
                gameState.shouts[playerState.index] = params.price
                global.clearInterval(this.timer)
                this.timer = global.setInterval(async () => {
                    gameState.timer--
                    if (gameState.timer <= 0) {
                        gameState.traded = true
                        global.clearInterval(this.timer)
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