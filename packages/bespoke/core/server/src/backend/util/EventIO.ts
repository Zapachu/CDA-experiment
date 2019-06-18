import {Actor, SocketEvent, config, IActor, IConnection, IConnectionNamespace, IGameWithId} from 'bespoke-common'
import {Server} from 'http'
import {EventEmitter} from 'events'
import * as socketIO from 'socket.io'
import GameDAO from '../service/GameDAO'
import {Token, Setting} from './util'

export class EventIO {
    private static socketIOServer: socketIO.Server
    private static robotIOServer: RobotIOServer

    static emitEvent(nspId: string, event: string, ...args) {
        if (!(nspId && event && args.length)) {
            return
        }
        const socketNsp = this.socketIOServer.to(nspId),
            robotNsp = this.robotIOServer.to(nspId)
        socketNsp && socketNsp.emit(event, ...args)
        robotNsp && robotNsp.emit(event, ...args)
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

    static initRobotIOServer(subscribeOnConnection: (clientConn: IConnection) => void) {
        this.robotIOServer = new RobotIOServer()
        this.robotIOServer.on(SocketEvent.connection, (connection: RobotConnection) => {
            subscribeOnConnection(connection)
            this.robotIOServer.online(connection)
        })
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

    online(connection: RobotConnection) {
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
