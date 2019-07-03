import {UnixSocketEvent} from '@bespoke/share'
import {createServer} from 'net'
import {getSocketPath, Log, IpcConnection} from '.'

const namespace = 'hello'

setTimeout(()=>{
    createServer(socket =>
        new IpcConnection(socket)
            .on(UnixSocketEvent.asDaemon, (name, cb0, cb1, cb2) => {
                cb0(1)
                cb1('hello')
                cb2([1, 2, 3])
            })
    ).listen(getSocketPath(namespace))
}, 3e3)

IpcConnection.connect(namespace).then(ipcConnection =>
    ipcConnection.emit(UnixSocketEvent.asDaemon, 'hello', a => Log.d(a), b => Log.d(b), c => Log.d(c))
)