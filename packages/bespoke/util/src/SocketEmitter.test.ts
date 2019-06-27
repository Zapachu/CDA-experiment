import {UnixSocketEvent} from 'bespoke-core-share'
import {createServer} from 'net'
import {getSocketPath, Log, SocketEmitter} from '.'

const namespace = 'hello'

createServer(socket =>
    new SocketEmitter(namespace, socket)
        .on(UnixSocketEvent.daemonConnection, (name, cb0, cb1, cb2) => {
            cb0(1)
            cb1('hello')
            cb2([1, 2, 3])
        })
).listen(getSocketPath(namespace))

new SocketEmitter(namespace)
    .emit(UnixSocketEvent.daemonConnection, 'hello', a => Log.d(a), b => Log.d(b), c => Log.d(c))