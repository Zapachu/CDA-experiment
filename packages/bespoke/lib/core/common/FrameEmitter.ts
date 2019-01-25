import {config} from './config'
import {IMoveCallback} from './interface'
import {SocketEvent} from './baseEnum'
import {EventEmitter} from 'events'
import throttle = require('lodash/throttle')

export class FrameEmitter<MoveType, PushType, IMoveParams, IPushParams> {
    private listeners = new Map<PushType, Array<Function>>()
    private _emit = throttle((type: MoveType, params?: Partial<IMoveParams>, cb?: IMoveCallback) =>
        this.emitter.emit(SocketEvent.move, type, params, cb), config.minMoveInterval, {trailing: false}
    )

    constructor(private emitter: EventEmitter) {
        this.emitter.on(SocketEvent.push, (pushType: PushType, params: Partial<IPushParams>) => this.trigger(pushType, params))
    }

    private getListeners(pushType: PushType) {
        return this.listeners.get(pushType) || []
    }

    on(pushType: PushType, fn: (params: Partial<IPushParams>) => void) {
        this.listeners.set(pushType, [...this.getListeners(pushType), fn])
    }

    trigger(pushType: PushType, params: Partial<IPushParams>) {
        this.getListeners(pushType).forEach(fn => fn(params))
    }

    emit(moveType: MoveType, params?: Partial<IMoveParams>, cb?: IMoveCallback) {
        this._emit(moveType, params, cb)
    }
}