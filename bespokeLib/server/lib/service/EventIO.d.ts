/// <reference types="node" />
import { IActor, IConnection, IGameWithId, SocketEvent } from '@bespoke/share';
import { IpcEvent } from '@elf/util';
import { Server } from 'http';
import * as SocketIO from 'socket.io';
export declare class EventIO {
    private static robotIOServer;
    private static socketIOServer;
    static emitEvent(nspId: string, event: SocketEvent | IpcEvent, ...args: any[]): void;
    static initSocketIOServer(server: Server, subscribeOnConnection: (connection: IConnection) => void): SocketIO.Server;
    static initRobotIOServer(subscribeOnConnection: (connection: IConnection) => void): void;
    static startRobot<IRobotMeta>(actor: IActor, game: IGameWithId<any>, meta: IRobotMeta): void;
}
