import {
    Actor,
    config,
    IActor,
    IConnection,
    IConnectionNamespace,
    IGameWithId,
    INewRobotParams,
    ISocketHandshakeQuery,
    SocketEvent,
    UnixSocketEvent
} from 'bespoke-core-share'
import {createServer, Socket} from 'net'
import {existsSync, unlinkSync} from 'fs'
import {Server} from 'http'
import {EventEmitter} from 'events'
import * as socketIO from 'socket.io'
import {GameDAO} from '../service'
import {Setting, Token} from './util'
import {getSocketPath, SocketWrapper} from './unixSocket'

export class EventIO {
    private static socketRobotServer: SocketRobotServer
    private static socketIOServer: socketIO.Server
    private static robotIOServer: RobotIOServer

    static emitEvent(nspId: string, event: SocketEvent | UnixSocketEvent, ...args) {
        if (!(nspId && event && args.length)) {
            return
        }
        const socketNsp = this.socketIOServer.to(nspId),
            robotNsp = this.robotIOServer.to(nspId),
            unixSocketNsp = this.socketRobotServer.to(nspId)
        socketNsp && socketNsp.emit(event, ...args)
        robotNsp && robotNsp.emit(event, ...args)
        unixSocketNsp && unixSocketNsp.emit(event, ...args)
    }

    static initSocketIOServer(server: Server, subscribeOnConnection: (clientConn: IConnection) => void): socketIO.Server {
        this.socketIOServer = socketIO(server, {path: config.socketPath(Setting.namespace)})
        this.socketIOServer.on(SocketEvent.connection, async (connection: socketIO.Socket) => {
            const {query: {token, gameId}, session: {passport: {user} = {user: undefined}}, sessionID} = connection.handshake
            const game = await GameDAO.getGame(gameId)
            const actor: IActor = Token.checkToken(token) ?
                game.owner === user ? {type: Actor.clientRobot, token} : {type: Actor.player, token} :
                game.owner === user ?
                    {type: Actor.owner, token: Token.geneToken(user)} :
                    {type: Actor.player, token: Token.geneToken(user || sessionID)}
            subscribeOnConnection(Object.assign(connection, {actor, game}) as any)
        })
        return this.socketIOServer
    }

    static initSocketRobotServer(subscribeOnConnection: (clientConn: IConnection) => void) {
        const socketPath = getSocketPath()
        if (existsSync(socketPath)) {
            unlinkSync(socketPath)
        }
        this.socketRobotServer = new SocketRobotServer()
        createServer(socket => {
            const socketWrapper: SocketWrapper = new SocketWrapper(socket)
            socketWrapper
                .on(UnixSocketEvent.mainConnection, () => this.socketRobotServer.mainConnection = socketWrapper)
                .on(SocketEvent.connection, async ({id, token, gameId}: ISocketHandshakeQuery) => {
                    const game = await GameDAO.getGame(gameId),
                        actor: IActor = {token, type: Actor.socketRobot}
                    const socketConnection = new SocketConnection(id, actor, game, socket)
                    subscribeOnConnection(socketConnection)
                    this.socketRobotServer.initNamespace(socketConnection)
                })
        }).listen(socketPath)
    }

    static initRobotIOServer(subscribeOnConnection: (clientConn: IConnection) => void) {
        this.robotIOServer = new RobotIOServer()
        this.robotIOServer.on(SocketEvent.connection, (connection: RobotConnection) => {
            subscribeOnConnection(connection)
            this.robotIOServer.initNamespace(connection)
        })
    }

    static socketRobotConnect(id: string, actor: IActor, game: IGameWithId<any>) {
        this.socketRobotServer.mainConnection.emit(UnixSocketEvent.newRobot, {id, actor, game} as INewRobotParams)
    }

    static robotConnect(id: string, actor: IActor, game: IGameWithId<any>): RobotConnection {
        const robotConnection = new RobotConnection(id, actor, game)
        this.robotIOServer.emit(SocketEvent.connection, robotConnection)
        return robotConnection
    }
}

class RobotIOServer extends EventEmitter {
    private namespaces: { [room: string]: RobotNamespace } = {}

    getNamespace(nsp: string): RobotNamespace {
        if (!this.namespaces[nsp]) {
            this.namespaces[nsp] = new RobotNamespace((nsp))
        }
        return this.namespaces[nsp]
    }

    initNamespace(connection: RobotConnection) {
        this.namespaces[connection.id] = new RobotNamespace(connection.id)
        connection.robotIOServer = this
        connection.join(connection.id)
    }

    to(clientId: string): RobotNamespace {
        return this.namespaces[clientId]
    }
}

class RobotNamespace extends EventEmitter implements IConnectionNamespace {
    private connections: { [connectionId: string]: RobotConnection } = {}

    constructor(id: string) {
        super()
    }

    addConnection(connection: RobotConnection): RobotNamespace {
        this.connections[connection.id] = connection
        return this
    }

    emit(event: string | symbol, ...args): boolean {
        let success = true
        for (let id in this.connections) {
            if (!this.connections[id].emit(event, ...args)) {
                success = false
            }
        }
        return success
    }
}

export class RobotConnection extends EventEmitter implements IConnection {
    robotIOServer: RobotIOServer

    constructor(public id: string, public actor: IActor, public game: IGameWithId<any>) {
        super()
    }

    join(nsp: string): RobotNamespace {
        return this.robotIOServer.getNamespace(nsp).addConnection(this)
    }
}

class SocketRobotServer {
    private namespaces: { [room: string]: SocketRobotNamespace } = {}
    mainConnection: SocketWrapper

    getNamespace(nsp: string): SocketRobotNamespace {
        if (!this.namespaces[nsp]) {
            this.namespaces[nsp] = new SocketRobotNamespace((nsp))
        }
        return this.namespaces[nsp]
    }

    initNamespace(connection: SocketConnection) {
        this.namespaces[connection.id] = new SocketRobotNamespace(connection.id)
        connection.robotIOServer = this
        connection.join(connection.id)
    }

    to(clientId: string): SocketRobotNamespace {
        return this.namespaces[clientId]
    }
}

class SocketRobotNamespace extends EventEmitter implements IConnectionNamespace {
    private connections: { [connectionId: string]: SocketConnection } = {}

    constructor(id: string) {
        super()
    }

    addConnection(connection: SocketConnection): SocketRobotNamespace {
        this.connections[connection.id] = connection
        return this
    }

    emit(event: SocketEvent | UnixSocketEvent, ...args): boolean {
        let success = true
        for (let id in this.connections) {
            if (!this.connections[id].emit(event, ...args)) {
                success = false
            }
        }
        return success
    }
}

export class SocketConnection extends SocketWrapper implements IConnection {
    robotIOServer: SocketRobotServer

    constructor(public id: string, public actor: IActor, public game: IGameWithId<any>, socket:Socket) {
        super(socket)
    }

    join(nsp: string): SocketRobotNamespace {
        return this.robotIOServer.getNamespace(nsp).addConnection(this)
    }
}
