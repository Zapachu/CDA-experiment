import {SocketEvent, UnixSocketEvent} from 'bespoke-core-share'
import {StringDecoder} from 'string_decoder'
import {EventEmitter} from 'events'
import * as path from 'path'
import * as os from 'os'
import * as net from 'net'

export function getSocketPath(namespace): string {
    let socketPath = path.join(os.tmpdir(), namespace)
    if (process.platform === 'win32') {
        socketPath = socketPath.replace(/^\//, '')
        socketPath = socketPath.replace(/\//g, '-')
        socketPath = '\\\\.\\pipe\\' + socketPath
    }
    return socketPath
}

type TMsgPack = [SocketEvent | UnixSocketEvent, ...any[]]

class CallbackHelper {
    static readonly prefix = 'cb_'
    private cursor = 0
    private cbMap = new Map()

    static isKey(key: any) {
        return typeof key === 'string' && key.startsWith(this.prefix)
    }

    deposit(fn: Function): string {
        this.cbMap.set(this.cursor, fn)
        return `${CallbackHelper.prefix}${this.cursor++}`
    }

    consume(key: string, ...args): void {
        const cursor = +key.replace(CallbackHelper.prefix, '')
        const fn = this.cbMap.get(cursor)
        fn(...args)
        this.cbMap.delete(cursor)
    }
}

export class SocketEmitter extends EventEmitter {
    private decoder = new StringDecoder('utf8')
    private jsonBuffer = ''
    private callbackHelper = new CallbackHelper()

    constructor(namespace: string, public socket: net.Socket = net.connect(getSocketPath(namespace))) {
        super()
        this.socket.on('data', buf => {
            this.feed(buf)
        })
    }

    encode(...msgPack: TMsgPack): string {
        const [event, ...args] = msgPack
        return JSON.stringify([event, ...args.map(arg => {
            if (typeof arg !== 'function') {
                return arg
            }
            return this.callbackHelper.deposit(arg)
        })])
    }

    decode(msgStr: string): TMsgPack {
        const [event, ...args] = JSON.parse(msgStr) as TMsgPack
        if (event === UnixSocketEvent.callback) {
            this.callbackHelper.consume(...args as [string, ...any[]])
            return [null]
        }
        return [event, ...args.map(arg => {
            if (!CallbackHelper.isKey(arg)) {
                return arg
            }
            return (...args) => this.emit(UnixSocketEvent.callback, arg, ...args)
        })]
    }

    feed(buf) {
        let jsonBuffer = this.jsonBuffer
        jsonBuffer += this.decoder.write(buf)
        let i, start = 0
        while ((i = jsonBuffer.indexOf('\n', start)) >= 0) {
            const json = jsonBuffer.slice(start, i)
            const [event, ...args] = this.decode(json)
            if (this.eventNames().includes(event)) {
                super.emit(event, ...args)
            }
            start = i + 1
        }
        this.jsonBuffer = jsonBuffer.slice(start)
    }

    on(event: SocketEvent | UnixSocketEvent, listener: (...args: any[]) => void): this {
        return super.on(event, listener)
    }

    emit(...args: TMsgPack): boolean {
        return this.socket.write(`${this.encode(...args)}\n`)
    }
}