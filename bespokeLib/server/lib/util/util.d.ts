import { IStartOption } from '@bespoke/share';
export declare function gameId2PlayUrl(gameId: string, keyOrToken?: string): string;
export declare function getOrigin(): string;
export declare function heartBeat(key: string, getValue: () => string, seconds?: number): void;
export declare class Setting {
    static namespace: string;
    static staticPath: string;
    private static _ip;
    private static _port;
    static readonly ip: string;
    static readonly port: number;
    static setPort(port: number): void;
    static init(namespace: string, staticPath: string, startOption: IStartOption): void;
    static getClientPath(): string;
}
