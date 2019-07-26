/// <reference types="node" />
import { EventEmitter } from 'events';
import * as net from 'net';
export declare enum IpcEvent {
    asDaemon = "asDaemon",
    startRobot = "startRobot",
    callback = "callback"
}
export declare function getSocketPath(namespace: any): string;
declare type TMsgPack = [string, ...any[]];
export declare class IpcConnection extends EventEmitter {
    socket: net.Socket;
    private decoder;
    private jsonBuffer;
    private callbackHelper;
    private static readonly CONNECT_TTL;
    private static createConnection;
    static connect(namespace: string): Promise<IpcConnection>;
    constructor(socket: net.Socket);
    encode(...msgPack: TMsgPack): string;
    decode(msgStr: string): TMsgPack;
    feed(buf: any): void;
    on(event: string, listener: (...args: any[]) => void): this;
    emit(...args: TMsgPack): boolean;
}
export {};
