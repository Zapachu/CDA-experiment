import {
    Actor,
    config,
    IActor,
    IConnection,
    IConnectionNamespace,
    IGameWithId,
    IRobotHandshake,
    IUserWithId,
    SocketEvent
} from '@bespoke/share'
import {getSocketPath, IpcConnection, IpcEvent, Log, Token} from '@elf/util'
import {createServer, Socket} from 'net'
import {existsSync, unlinkSync} from 'fs'
import {Server} from 'http'
import * as SocketIO from 'socket.io'
import {GameDAO} from './GameDAO'
import {Setting} from '../util'
import {EventEmitter} from 'events'
import {UserModel} from '../model'
import {elfSetting} from '@elf/setting'

export class EventIO {
    private static robotIOServer: RobotIO.Server
    private static socketIOServer: SocketIO.Server

    static emitEvent(nspId: string, event: SocketEvent | IpcEvent, ...args) {
        if (!(nspId && event && args.length)) {
            return
        }
        const socketNsp = this.socketIOServer.to(nspId),
            unixSocketNsp = this.robotIOServer.to(nspId)
        socketNsp && socketNsp.emit(event, ...args)
        unixSocketNsp && unixSocketNsp.emit(event, ...args)
    }

    static initSocketIOServer(server: Server, subscribeOnConnection: (connection: IConnection) => void): SocketIO.Server {
        this.socketIOServer = SocketIO(server, {path: config.socketPath(Setting.namespace)})
        this.socketIOServer.on(SocketEvent.connection, async (connection: SocketIO.Socket) => {
            const {query: {token, gameId}, session: {passport: {user: userId} = {user: undefined}, actor: linkerActor}, sessionID} = connection.handshake
            const game = await GameDAO.getGame(gameId)
            const actor: IActor = Token.checkToken(token) ?
                game.owner === userId ? {type: Actor.clientRobot, token} : {type: Actor.player, token} :
                game.owner === userId ? {type: Actor.owner, token: Token.geneToken(userId)} :
                    elfSetting.bespokeWithLinker ? linkerActor :
                        {type: Actor.player, token: Token.geneToken(userId || sessionID)}
            let user: IUserWithId = null
            if (userId) {
                const {id, mobile, name, role} = await UserModel.findById(userId)
                user = {id, mobile, name, role}
            }
            subscribeOnConnection(Object.assign(connection, {actor, game, user}) as any)
            connection.emit(SocketEvent.connection, actor)
        })
        return this.socketIOServer
    }

    static initRobotIOServer(subscribeOnConnection: (connection: IConnection) => void) {
        const socketPath = getSocketPath(Setting.namespace)
        if (existsSync(socketPath)) {
            unlinkSync(socketPath)
        }
        this.robotIOServer = new RobotIO.Server()
        createServer(socket => {
            const ipcConnection: IpcConnection = new IpcConnection(socket)
            ipcConnection
                .on(IpcEvent.asDaemon, () => {
                    Log.i('Robot daemon connection initialized')
                    this.robotIOServer.daemonConnection = ipcConnection
                })
                .on(SocketEvent.connection, async ({actor, game}: IRobotHandshake, cb) => {
                    Log.i(`RobotConnect : ${actor.token}`)
                    const socketConnection = new RobotIO.Connection(actor, game, socket)
                    subscribeOnConnection(socketConnection)
                    this.robotIOServer.initNamespace(socketConnection)
                    cb()
                })
        }).listen(socketPath)
    }

    static startRobot<IRobotMeta>(actor: IActor, game: IGameWithId<any>, meta: IRobotMeta) {
        if (!this.robotIOServer.daemonConnection) {
            Log.w('Robot daemon connection not initialized yet')
        }
        this.robotIOServer.daemonConnection.emit(IpcEvent.startRobot, {actor, game} as IRobotHandshake, meta)
    }
}

namespace RobotIO {
    export class Server {
        private namespaces: { [room: string]: Namespace } = {}
        daemonConnection: IpcConnection

        getNamespace(nsp: string): Namespace {
            if (!this.namespaces[nsp]) {
                this.namespaces[nsp] = new Namespace()
            }
            return this.namespaces[nsp]
        }

        initNamespace(connection: Connection) {
            this.namespaces[connection.id] = new Namespace()
            connection.robotIOServer = this
            connection.join(connection.id)
        }

        to(clientId: string): Namespace {
            return this.namespaces[clientId]
        }
    }

    class Namespace extends EventEmitter implements IConnectionNamespace {
        private connections: { [connectionId: string]: Connection } = {}

        addConnection(connection: Connection): Namespace {
            this.connections[connection.id] = connection
            return this
        }

        emit(event: SocketEvent | IpcEvent, ...args): boolean {
            let success = true
            for (let id in this.connections) {
                if (!this.connections[id].emit(event, ...args)) {
                    success = false
                }
            }
            return success
        }
    }

    export class Connection extends IpcConnection implements IConnection {
        id: string
        robotIOServer: Server

        constructor(public actor: IActor, public game: IGameWithId<any>, socket: Socket) {
            super(socket)
            this.id = actor.token
        }

        join(nsp: string): Namespace {
            return this.robotIOServer.getNamespace(nsp).addConnection(this)
        }
    }
}