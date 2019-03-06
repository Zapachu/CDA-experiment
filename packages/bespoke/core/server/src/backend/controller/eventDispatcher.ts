import {Server} from 'http'
import {EventHandler} from './eventHandler'
import {EventIO, Log} from '../util'
import {IConnection, IEventHandler} from 'bespoke-common'

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

    static startGameSocket(server: Server): Server {
        EventIO.initSocketIOServer(server, this.subscribeOnConnection)
        EventIO.initRobotIOServer(this.subscribeOnConnection)
        return server
    }
}

