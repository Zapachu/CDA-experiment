import {Server} from 'http'
import {config, IGameWithId, ILinkerActor, SocketEvent} from 'linker-share'
import * as socketIO from 'socket.io'
import {EventHandler} from './eventHandler'
import {Log} from '@elf/util'
import {EventEmitter} from 'events'
import {GameService} from '../service'
import {UserModel} from '../model'

export interface IConnection extends EventEmitter {
    id: string
    actor: ILinkerActor
    game: IGameWithId

    on(eventType: string, handler: IEventHandler): this

    join(name: string | string[], fn?: (err?: any) => void): IConnection;
}

export interface IEventHandler {
    (emitter: IConnection, ...args: any[]): void
}

export class EventDispatcher {
    static socket: socketIO.Server

    static startSocketService(server: Server): socketIO.Server {
        this.socket = socketIO(server, {path: config.socketPath})
        this.socket.on(SocketEvent.connection, async (connection: socketIO.Socket) => {
            const {token, type, gameId, playerId} = connection.handshake.query
            const userId = connection.handshake.session.passport.user
            const game = await GameService.getGame(gameId)
            const {name} = await UserModel.findById(userId)
            const actor: ILinkerActor = {token, type, userId, userName: name, playerId}
            this.subscribeOnConnection(Object.assign(connection, {actor, game}) as any)
        })
        return this.socket
    }

    private static subscribeOnConnection(clientConn: IConnection) {
        Object.entries<IEventHandler>(EventHandler).forEach(([event, handler]) => {
            clientConn.on(event, async (...args) => {
                Log.d(event, ...args.filter(arg => typeof arg !== 'function'))
                try {
                    handler(clientConn, ...args)
                } catch (err) {
                    Log.e(err)
                }
            })
        })
    }
}
