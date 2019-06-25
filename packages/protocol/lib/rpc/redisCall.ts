import {Log} from '../util'
import {elfSetting} from 'elf-setting'
import * as IORedis from 'ioredis'

const BLOCK_SECOND = 5

export const redisClient = new IORedis(elfSetting.redisPort, elfSetting.redisHost)

export namespace RedisCall {
    interface IReqPack<IReq> {
        key: string
        method: string
        params: IReq
    }

    function getServiceKey(method: string) {
        return `rpc:${method}`
    }

    function geneReqKey(): string {
        return Math.random().toString(36).substr(2)
    }

    function getBlockRedisClient(): IORedis.Redis {
        return new IORedis(elfSetting.redisPort, elfSetting.redisHost)
    }

    function _handle<IReq, IRes>(method: string, handler: (req: IReq) => Promise<IRes>, redis: IORedis.Redis) {
        redis.blpop(getServiceKey(method), 0 as any).then(async ([, reqText]) => {
            Log.i(method, reqText)
            const reqPack: IReqPack<IReq> = JSON.parse(reqText)
            const res = await handler(reqPack.params)
            redis.rpush(reqPack.key, JSON.stringify(res))
            redis.expire(reqPack.key, BLOCK_SECOND).catch(e => Log.e(e))
            _handle(method, handler, redis)
        })
    }

    export function handle<IReq, IRes>(method: string, handler: (req: IReq) => Promise<IRes>) {
        _handle(method, handler, getBlockRedisClient())
    }

    export async function call<IReq, IRes>(method: string, params: IReq): Promise<IRes> {
        const redis = getBlockRedisClient()
        const key = geneReqKey(), reqPack: IReqPack<IReq> = {method, params, key}
        redis.rpush(getServiceKey(method), JSON.stringify(reqPack))
        const res = await redis.blpop(key, BLOCK_SECOND as any)
        if (!res) {
            await redis.del(getServiceKey(method))
            throw new Error(`RedisCall Time out : ${JSON.stringify(reqPack)}`)
        }
        redis.disconnect()
        return JSON.parse(res[1])
    }
}

export * from './interface'