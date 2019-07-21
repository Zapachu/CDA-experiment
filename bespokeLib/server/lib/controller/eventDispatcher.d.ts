/// <reference types="node" />
import { Server } from 'http';
import * as socketIO from 'socket.io';
export declare class EventDispatcher {
    private static subscribeOnConnection;
    static startGameSocket(server: Server): socketIO.Server;
}
