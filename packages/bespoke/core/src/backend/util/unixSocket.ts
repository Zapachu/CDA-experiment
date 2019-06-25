import {StringDecoder} from 'string_decoder'
import {ISocketMsgPack, SocketEvent, UnixSocketEvent} from 'bespoke-core-share'
import {EventEmitter} from 'events'
import * as path from 'path'
import * as os from 'os'
import * as net from 'net'

export function getSocketPath(namespace = 'midway.sock'): string {
    let socketPath = path.join(os.tmpdir(), namespace)
    if (process.platform === 'win32') {
        socketPath = socketPath.replace(/^\//, '')
        socketPath = socketPath.replace(/\//g, '-')
        socketPath = '\\\\.\\pipe\\' + socketPath
    }
    return socketPath
}

export class SocketWrapper extends EventEmitter {
    private decoder = new StringDecoder('utf8')
    private jsonBuffer = ''

    static encode(message: ISocketMsgPack) {
        return JSON.stringify(message) + '\n'
    }

    constructor(private socket: net.Socket = net.connect(getSocketPath())) {
        super()
        this.socket.on('data', buf => {
            this.feed(buf)
        })
    }

    feed(buf) {
        let jsonBuffer = this.jsonBuffer
        jsonBuffer += this.decoder.write(buf)
        let i, start = 0
        while ((i = jsonBuffer.indexOf('\n', start)) >= 0) {
            const json = jsonBuffer.slice(start, i)
            const {event, params} = JSON.parse(json) as ISocketMsgPack
            if(this.eventNames().includes(event)){
                this.emit(event, params)
            }
            start = i + 1
        }
        this.jsonBuffer = jsonBuffer.slice(start)
    }

    on(event: SocketEvent | UnixSocketEvent, listener: (...args: any[]) => void): this {
        return super.on(event, listener)
    }

    emit(event: SocketEvent | UnixSocketEvent, ...args): boolean {
        return this.eventNames().includes(event) ?
            super.emit(event, ...args) :
            this.socket.write(SocketWrapper.encode({event, params: args[0]}))
    }
}