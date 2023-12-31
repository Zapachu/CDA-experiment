import {
  Actor,
  CoreMove,
  GameStatus,
  IActor,
  IConnection,
  IGameWithId,
  IMoveCallback,
  SocketEvent,
  SyncStrategy,
  TGameState,
  TPlayerState
} from '@bespoke/share'
import { Log, Token } from '@elf/util'
import { Linker, RedisCall } from '@elf/protocol'
import { EventIO } from './EventIO'
import { GameDAO } from './GameDAO'
import { StateManager } from './StateManager'
import { MoveQueue } from './MoveQueue'

export type AnyLogic = BaseLogic<any, any, any, any, any, any, any>

export class BaseLogic<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  IRobotMeta = {}
> {
  private static sncStrategy: SyncStrategy
  private static Controller: new (...args) => AnyLogic
  private static controllers = new Map<string, AnyLogic>()

  static init(Controller: new (...args) => AnyLogic, sncStrategy: SyncStrategy = SyncStrategy.default) {
    this.Controller = Controller
    this.sncStrategy = sncStrategy
  }

  static async getLogic(gameId: string): Promise<AnyLogic> {
    if (!this.controllers.get(gameId)) {
      const game = await GameDAO.getGame(gameId)
      this.controllers.set(gameId, new this.Controller(game).init())
    }
    return this.controllers.get(gameId)
  }

  private moveQueue: MoveQueue<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>
  public connections = new Map<string, IConnection>()
  stateManager: StateManager<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>

  constructor(public game?: IGameWithId<ICreateParams>) {}

  init(): this {
    this.stateManager = new StateManager<
      ICreateParams,
      IGameState,
      IPlayerState,
      MoveType,
      PushType,
      IMoveParams,
      IPushParams
    >(BaseLogic.sncStrategy, this)
    this.moveQueue = new MoveQueue(this.game, this.stateManager)
    return this
  }

  getGame4Player() {
    return this.game
  }

  initGameState(): TGameState<IGameState> {
    return {
      status: GameStatus.started
    } as any
  }

  filterGameState(gameState: TGameState<IGameState>): any {
    return gameState
  }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const connection = this.connections.get(actor.token)
    return {
      actor,
      user: connection ? connection.user || {} : {}
    } as any
  }

  async onGameOver(): Promise<void> {}

  async moveReducer(
    actor: IActor,
    type: MoveType | CoreMove,
    params: IMoveParams & { status: GameStatus },
    cb: IMoveCallback
  ): Promise<void> {
    this.moveQueue.push(actor, type, params, async () => {
      if (actor.type === Actor.owner) {
        switch (type) {
          case CoreMove.switchGameStatus: {
            const gameState = await this.stateManager.getGameState()
            if (params.status === GameStatus.over) {
              await this.onGameOver()
            }
            gameState.status = params.status
            break
          }
          default: {
            await this.teacherMoveReducer(actor, type, params, cb)
          }
        }
      } else {
        await this.playerMoveReducer(actor, type as MoveType, params, cb)
      }
    })
  }

  protected async playerMoveReducer(
    actor: IActor,
    type: MoveType,
    params: IMoveParams,
    cb: IMoveCallback
  ): Promise<void> {
    Log.i(actor.token, type, params, cb)
  }

  protected async teacherMoveReducer(
    actor: IActor,
    type: MoveType,
    params: IMoveParams,
    cb: IMoveCallback
  ): Promise<void> {
    Log.i(actor.token, type, params, cb)
  }

  async startRobot(key, meta?: IRobotMeta) {
    const actor: IActor = { token: Token.geneToken(`${this.game.id}${key}`), type: Actor.serverRobot }
    EventIO.startRobot<IRobotMeta>(actor, this.game, meta)
  }

  //region pushEvent
  protected push(actors: IActor | IActor[], type: PushType, params?: Partial<IPushParams>) {
    const _actors = Array.isArray(actors) ? actors : [actors]
    setTimeout(
      () =>
        _actors.forEach(actor => {
          try {
            EventIO.emitEvent(this.connections.get(actor.token).id, SocketEvent.push, type, params)
          } catch (e) {
            Log.e(e)
          }
        }),
      0
    )
  }

  protected broadcast(type: PushType, params?: Partial<IPushParams>) {
    setTimeout(() => EventIO.emitEvent(this.game.id, SocketEvent.push, type, params), 0)
  }

  //endregion

  //region elf
  protected setPhaseResult(playerToken: string, result: Linker.Result.IResult) {
    if (!this.game.elfGameId) {
      return Log.w('Bespoke单独部署，game未关联至Linker')
    }
    RedisCall.call<Linker.Result.IReq, Linker.Result.IRes>(Linker.Result.name, {
      playerToken,
      elfGameId: this.game.elfGameId,
      result
    }).catch(e => Log.e(e))
  }

  //endregion
}

export { StateManager }
