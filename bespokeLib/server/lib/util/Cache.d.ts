export interface CacheData {
    timestamp: number;
    value: any;
}
export declare class Cache {
    static set(key: string, value: any): void;
    static get(key: string): CacheData;
}
