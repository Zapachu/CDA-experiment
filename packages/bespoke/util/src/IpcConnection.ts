import {SocketEvent, UnixSocketEvent} from 'bespoke-core-share'
import {StringDecoder} from 'string_decoder'
import {EventEmitter} from 'events'
import * as path from 'path'
import * as os from 'os'
import * as net from 'net'
import {Log} from './Log'

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

export class IpcConnection extends EventEmitter {
    private decoder = new StringDecoder('utf8')
    private jsonBuffer = ''
    private callbackHelper = new CallbackHelper()

    //region connect
    private static readonly CONNECT_TTL = 5

    private static async createConnection(path: string, ttl: number): Promise<net.Socket> {
        return new Promise<net.Socket>(resolve => {
            const socket = net.connect(path, () => resolve(socket))
                .on('error', () => {
                    Log.e(`Connect to ipc failed, remaining times: ${ttl}`)
                    ttl === 0 ? process.exit() : setTimeout(() => this.createConnection(path, ttl - 1), 1e3)
                })
        })
    }

    static async connect(namespace: string): Promise<IpcConnection> {
        const socket = await this.createConnection(getSocketPath(namespace), this.CONNECT_TTL)
        return new IpcConnection(socket)
    }

    //endregion

    constructor(public socket: net.Socket) {
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