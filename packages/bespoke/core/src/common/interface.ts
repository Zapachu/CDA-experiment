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
    groupId?: string
    owner: string
    namespace: string
}

export interface IGameWithId<ICreateParams>extends IGame<ICreateParams> {
    id: string
}

export interface IGameThumb {
    id: string
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

export interface IQCloudSMS {
    appId: string
    appKey: string
    smsSign: string
    templateId: {
        verifyCode: string
    }
}

export interface IQiniuConfig {
    upload: {
        ACCESS_KEY: string
        SECRET_KEY: string
        bucket: string
        path: string
    },
    download: {
        jsDomain: string
    }
}

export interface ICoreSetting {
    host: string
    mongoUri: string
    mongoUser: string
    mongoPass: string
    redisHost: string
    redisPort: number
    sessionSecret: string
    //region RPC
    proxyService: {
        host: string
        port: number
    }
    academusServiceUri: string
    pythonRobotUri: string
    elfGameServiceUri: string
    //endregion
    qCloudSMS: IQCloudSMS
    qiNiu: IQiniuConfig
    mail: {
        smtpHost: string
        smtpUsername: string
        smtpPassword: string
    }
    adminMobileNumbers: Array<string>
}

export interface ISetting extends Partial<ICoreSetting> {
    namespace: string
    getClientPath: () => string
    staticPath: string
    independent?: boolean
    port?: number
    rpcPort?: number
}