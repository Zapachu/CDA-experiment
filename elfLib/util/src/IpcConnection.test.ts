import {createServer} from 'net'
import {getSocketPath, IpcConnection, IpcEvent} from './IpcConnection'
import {Log} from './Log'

const namespace = 'hello'

setTimeout(() => {
    createServer(socket =>
        new IpcConnection(socket)
            .on(IpcEvent.asDaemon, (name, cb0, cb1, cb2) => {
                cb0(1)
                cb1('hello')
                cb2([1, 2, 3])
            })
    ).listen(getSocketPath(namespace))
}, 3e3)

IpcConnection.connect(namespace).then(ipcConnection =>
    ipcConnection.emit(IpcEvent.asDaemon, 'hello', a => Log.d(a), b => Log.d(b), c => Log.d(c))
)