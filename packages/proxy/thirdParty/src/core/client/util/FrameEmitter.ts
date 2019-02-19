import {TSocket, baseEnum} from "@core/common";

export class FrameEmitter<UpFrame, DownFrame> {
    private listeners = new Map<DownFrame, (...args: any[]) => void>()

    constructor(private phaseId: string, private playerToken, private socket: TSocket) {
        this.socket.on(baseEnum.SocketEvent.push, (downFrame: DownFrame, ...args) => {
            const fn = this.listeners.get(downFrame)
            fn && fn(...args)
        })
    }

    on(downFrame: DownFrame, fn: (...args: any[]) => void) {
        this.listeners.set(downFrame, fn)
    }

    emit(upFrame: UpFrame, ...args: any[]) {
        this.socket.emit(baseEnum.SocketEvent.move, this.phaseId, this.playerToken, upFrame, ...args)
    }
}