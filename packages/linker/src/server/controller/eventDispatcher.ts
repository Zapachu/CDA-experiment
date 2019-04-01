import {Server} from 'http'
import {config, baseEnum, IActor, IGameWithId} from '@common'
import * as socketIO from 'socket.io'
import {EventHandler} from './eventHandler'
import {Log} from "@server-util"
import {EventEmitter} from "events"
import {GameService} from '@server-service'
import {UserModel} from '@server-model'

export interface IConnection extends EventEmitter {
    id: string
    actor: IActor
    group: IGameWithId

    on(eventType: string, handler: IEventHandler): this

    join(name: string | string[], fn?: (err?: any) => void): IConnection;
}

export interface IEventHandler {
    (emitter: IConnection, ...args: any[]): void
}

export class EventDispatcher {
    static socket: socketIO.Server

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

    static startGroupSocket(server: Server): Server {
        this.socket = socketIO(server, {path: config.socketPath})
        this.socket.on(baseEnum.SocketEvent.connection, async (connection: socketIO.Socket) => {
            const {token, type, gameId, userId, playerId} = connection.handshake.query
            const group = await GameService.getGame(gameId)
            const {name} = await UserModel.findById(userId)
            const actor:IActor = {token, type, userId, userName:name, playerId}
            this.subscribeOnConnection(Object.assign(connection, {actor, group}) as any)
        })
        return server
    }
}
