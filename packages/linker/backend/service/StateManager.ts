import { IGameState, IGameWithId, ILinkerActor, SocketEvent } from 'linker-share'
import { GameService } from './GameService'
import { GameStateDoc, GameStateModel, PlayerModel } from '../model'
import { EventDispatcher } from '../controller/eventDispatcher'
import { Log } from '@elf/util'
import { Linker, RedisCall } from '@elf/protocol'

const stateManagers: { [gameId: string]: StateManager } = {}

export class StateManager {
  gameState: IGameState

  constructor(public game: IGameWithId) {}

  static async getManager(gameId: string) {
    if (!stateManagers[gameId]) {
      const game = await GameService.getGame(gameId)
      stateManagers[gameId] = await new StateManager(game).init()
    }
    return stateManagers[gameId]
  }

  async init(): Promise<StateManager> {
    await this.initState()
    return this
  }

  async initState() {
    const gameStateDoc: GameStateDoc = await GameStateModel.findOne({ gameId: this.game.id })
    if (gameStateDoc) {
      this.gameState = gameStateDoc.data
      return
    }
    const { namespace, params } = this.game
    const { playUrl } = await RedisCall.call<Linker.Create.IReq, Linker.Create.IRes>(Linker.Create.name(namespace), {
      owner: this.game.owner,
      elfGameId: this.game.id,
      params
    })
    this.gameState = {
      gameId: this.game.id,
      playUrl,
      playerState: {}
    }
    await new GameStateModel({ gameId: this.game.id, data: this.gameState }).save()
  }

  async joinRoom(actor: ILinkerActor): Promise<void> {
    const {
      gameState: { playerState }
    } = this
    if (playerState[actor.token] === undefined) {
      playerState[actor.token] = {
        actor
      }
    }
  }

  async setPlayerResult(playerToken: string, result: Linker.Result.IResult): Promise<void> {
    const { gameState } = this
    const playerCurPhaseState = gameState.playerState[playerToken]
    if (!playerCurPhaseState) {
      return
    }
    PlayerModel.findByIdAndUpdate(
      playerCurPhaseState.actor.playerId,
      {
        result: result
      },
      err => err && Log.e(err)
    )
  }

  broadcastState() {
    Log.d(JSON.stringify(this.gameState))
    EventDispatcher.socket.in(this.game.id).emit(SocketEvent.syncGameState, this.gameState)
    GameStateModel.findOneAndUpdate(
      { gameId: this.game.id },
      {
        $set: {
          data: this.gameState,
          updateAt: Date.now()
        }
      },
      { new: true },
      err => (err ? Log.e(err) : null)
    )
  }
}
