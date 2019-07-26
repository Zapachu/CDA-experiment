import {GameStatus, SyncStrategy} from './enum'
import {EventEmitter} from 'events'
import {Socket} from 'socket.io-client'
import {Diff} from 'deep-diff'
import {AcademusRole, IActor} from '@elf/share'

export type TSocket = typeof Socket

export interface IUser {
    mobile: string
    role: AcademusRole
    name: string
}

export interface IUserWithId extends IUser {
    id: string
}

export interface ISimulatePlayer {
    gameId: string
    token: string
    name: string
}

export interface IGameConfig<ICreateParams> {
    title: string
    params: ICreateParams
}

export interface IGame<ICreateParams> extends IGameConfig<ICreateParams> {
    elfGameId?: string
    owner: string
    namespace: string
}

export interface IGameWithId<ICreateParams> extends IGame<ICreateParams> {
    id: string
}

export interface IGameThumb {
    id: string
    namespace: string
    title: string
    createAt: number
}

export type TGameState<IGameState> = IGameState & {
    status: GameStatus
    connectionId?: string
}

export type TPlayerState<IPlayerState> = IPlayerState & {
    actor: IActor
    user: IUserWithId
    connectionId?: string
}

export interface IMoveCallback {
    (...args: any[]): void
}

export interface IMoveLog<IGameState, IPlayerState, MoveType, IMoveParams> {
    seq: number
    gameId: string
    token: string
    type: MoveType
    params: IMoveParams
    gameState?: TGameState<{}>
    gameStateChanges?: Array<Diff<IGameState>>
    playerStates?: Array<TPlayerState<{}>>
    playerStatesChanges?: Array<Diff<{ [key: string]: IPlayerState }>>
}

export interface IFreeStyle {
    game: string
    data: {}
}

export interface IConnectionNamespace {
    addConnection?(conn: IConnection): IConnectionNamespace
}

export interface IConnection extends EventEmitter {
    id: string
    actor: IActor
    game: IGameWithId<any>
    user?: IUserWithId

    on(eventType: string, handler: IEventHandler): this

    join(nsp: string): IConnectionNamespace;
}

export interface IEventHandler {
    (connection: IConnection, ...args: any[]): void
}

export interface IStartOption {
    logPath?: string
    port?: number
    syncStrategy?: SyncStrategy
}

export interface IRobotHandshake {
    actor: IActor
    game: IGameWithId<any>
}