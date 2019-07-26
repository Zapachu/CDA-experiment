import * as IORedis from 'ioredis';
export declare const redisClient: IORedis.Redis;
export declare namespace RedisCall {
    function handle<IReq, IRes>(method: string, handler: (req: IReq) => Promise<IRes>): void;
    function call<IReq, IRes>(method: string, params: IReq, ttl?: number): Promise<IRes>;
}
export * from './interface';
