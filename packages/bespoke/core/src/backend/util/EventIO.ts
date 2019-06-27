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
import {getSocketPath, SocketEmitter} from 'bespoke-server-util'

export class EventIO {
    private static socketRobotServer: SocketRobotServer
    private static socketIOServer: socketIO.Server

    static emitEvent(nspId: string, event: SocketEvent | UnixSocketEvent, ...args) {
        if (!(nspId && event && args.length)) {
            return
        }
        const socketNsp = this.socketIOServer.to(nspId),
            unixSocketNsp = this.socketRobotServer.to(nspId)
        socketNsp && socketNsp.emit(event, ...args)
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
        const socketPath = getSocketPath(Setting.namespace)
        if (existsSync(socketPath)) {
            unlinkSync(socketPath)
        }
        this.socketRobotServer = new SocketRobotServer()
        createServer(socket => {
            const socketWrapper: SocketEmitter = new SocketEmitter(Setting.namespace, socket)
            socketWrapper
                .on(UnixSocketEvent.mainConnection, () => this.socketRobotServer.mainConnection = socketWrapper)
                .on(SocketEvent.connection, async ({id, token, gameId}: ISocketHandshakeQuery) => {
                    const game = await GameDAO.getGame(gameId),
                        actor: IActor = {token, type: Actor.serverRobot}
                    const socketConnection = new SocketConnection(id, actor, game, socket)
                    subscribeOnConnection(socketConnection)
                    this.socketRobotServer.initNamespace(socketConnection)
                })
        }).listen(socketPath)
    }

    static socketRobotConnect(id: string, actor: IActor, game: IGameWithId<any>) {
        this.socketRobotServer.mainConnection.emit(UnixSocketEvent.newRobot, {id, actor, game} as INewRobotParams)
    }
}

class SocketRobotServer {
    private namespaces: { [room: string]: SocketRobotNamespace } = {}
    mainConnection: SocketEmitter

    getNamespace(nsp: string): SocketRobotNamespace {
        if (!this.namespaces[nsp]) {
            this.namespaces[nsp] = new SocketRobotNamespace()
        }
        return this.namespaces[nsp]
    }

    initNamespace(connection: SocketConnection) {
        this.namespaces[connection.id] = new SocketRobotNamespace()
        connection.robotIOServer = this
        connection.join(connection.id)
    }

    to(clientId: string): SocketRobotNamespace {
        return this.namespaces[clientId]
    }
}

class SocketRobotNamespace extends EventEmitter implements IConnectionNamespace {
    private connections: { [connectionId: string]: SocketConnection } = {}

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

class SocketConnection extends SocketEmitter implements IConnection {
    robotIOServer: SocketRobotServer

    constructor(public id: string, public actor: IActor, public game: IGameWithId<any>, socket: Socket) {
        super(Setting.namespace, socket)
    }

    join(nsp: string): SocketRobotNamespace {
        return this.robotIOServer.getNamespace(nsp).addConnection(this)
    }
}
