import {AcademusRole, Actor, GameStatus} from './baseEnum'
import {EventEmitter} from 'events'
import {Socket} from 'socket.io-client'
import {Diff} from 'deep-diff'

export type TSocket = typeof Socket

export interface IUser {
    mobile: string
    role: AcademusRole
}

export interface IUserWithId extends IUser {
    id: string
}

export interface IActor {
    token: string
    type: Actor
}

export interface ISimulatePlayer {
    gameId: string
    token: string
    name: string
}

export interface IGameConfig<ICreateParams> {
    title: string
    desc: string
    params: ICreateParams
}

export interface IGame<ICreateParams> extends IGameConfig<ICreateParams> {
    elfGameId?: string
    owner: string
    namespace: string
}

export interface IGameWithId<ICreateParams>extends IGame<ICreateParams> {
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
    connectionId?: string
}

export interface IMoveCallback {
    (...args: any[]): void
}

export interface IMoveLog<IGameState, IPlayerState> {
    seq: number
    gameId: string
    token: string
    type: string
    params: {}
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

    on(eventType: string, handler: IEventHandler): this

    join(nsp: string): IConnectionNamespace;
}

export interface IEventHandler {
    (connection: IConnection, ...args: any[]): void
}

export interface IGameSetting {
    staticPath: string
}
