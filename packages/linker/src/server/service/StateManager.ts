import {IGameState, IGameWithId, ILinkerActor, NFrame, PhaseStatus, PlayerStatus, SocketEvent} from '@common'
import {GameService} from './GameService'
import {GameStateDoc, GameStateModel, PlayerModel} from '@server-model'
import {EventDispatcher} from '../controller/eventDispatcher'
import {Log} from '@elf/util'
import {NewPhase, RedisCall, SetPlayerResult} from '@elf/protocol'

const stateManagers: { [gameId: string]: StateManager } = {}

export class StateManager {
    static async getManager(gameId: string) {
        if (!stateManagers[gameId]) {
            const game = await GameService.getGame(gameId)
            stateManagers[gameId] = await (new StateManager(game)).init()
        }
        return stateManagers[gameId]
    }

    gameState: IGameState

    constructor(public game: IGameWithId) {
    }

    async init(): Promise<StateManager> {
        await this.initState()
        return this
    }

    async initState() {
        const gameStateDoc: GameStateDoc = await GameStateModel.findOne({gameId: this.game.id})
        if (gameStateDoc) {
            this.gameState = gameStateDoc.data
            return
        }
        const {namespace, param} = this.game
        const {playUrl} = await RedisCall.call<NewPhase.IReq, NewPhase.IRes>(NewPhase.name(namespace), {
            owner: this.game.owner,
            elfGameId: this.game.id,
            namespace,
            param: JSON.stringify(param)
        })
        this.gameState = {
            gameId: this.game.id,
            status: PhaseStatus.playing,
            playUrl,
            playerState: {}
        }
        await new GameStateModel({gameId: this.game.id, data: this.gameState}).save()
    }

    async joinRoom(actor: ILinkerActor): Promise<void> {
        const {gameState: {playerState}} = this
        if (playerState[actor.token] === undefined) {
            playerState[actor.token] = {
                actor,
                status: PlayerStatus.playing
            }
        }
    }

    async setPlayerResult(playUrl: string, playerToken: string, result: SetPlayerResult.IResult): Promise<void> {
        const {gameState} = this
        const playerCurPhaseState = gameState.playerState[playerToken]
        if (!playerCurPhaseState) {
            return
        }
        playerCurPhaseState.result = {...playerCurPhaseState.result, ...result}
        if (!playerCurPhaseState || playerCurPhaseState.status === PlayerStatus.left) {
            Log.w('玩家不在此环节中')
        }
        PlayerModel.findByIdAndUpdate(playerCurPhaseState.actor.playerId, {
            result: result
        }, err => err && Log.e(err))
    }

    broadcastState() {
        Log.d(JSON.stringify(this.gameState))
        EventDispatcher.socket.in(this.game.id)
            .emit(SocketEvent.downFrame, NFrame.DownFrame.syncGameState, this.gameState)
        GameStateModel.findOneAndUpdate({gameId: this.game.id}, {
            $set: {
                data: this.gameState,
                updateAt: Date.now()
            }
        }, {new: true}, err => err ? Log.e(err) : null)
    }
}
