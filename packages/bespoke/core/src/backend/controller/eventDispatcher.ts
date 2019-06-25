import {Server} from 'http'
import * as socketIO from 'socket.io'
import {EventHandler} from './eventHandler'
import {EventIO, Log} from '../util'
import {IConnection, IEventHandler} from 'bespoke-core-share'

export class EventDispatcher {
    private static subscribeOnConnection(clientConn: IConnection) {
        Object.entries<IEventHandler>(EventHandler).forEach(([event, handler]) => {
            clientConn.on(event, async (...args) => {
                Log.i(clientConn.actor.token, event,
                    ...args.filter(arg => ![null, undefined].includes(arg)).map(arg => {
                        switch (typeof arg) {
                            case 'function':
                                return 'CallbackFunction'
                            case 'object':
                                return JSON.stringify(arg)
                            default:
                                return arg
                        }
                    }))
                try {
                    handler(clientConn, ...args)
                } catch (err) {
                    Log.e(err)
                }
            })
        })
    }

    static startGameSocket(server: Server): socketIO.Server {
        const socketIOServer = EventIO.initSocketIOServer(server, this.subscribeOnConnection)
        EventIO.initSocketRobotServer(this.subscribeOnConnection)
        EventIO.initRobotIOServer(this.subscribeOnConnection)
        return socketIOServer
    }
}

