import {Log} from '../util'
import {elfSetting} from "elf-setting"
import * as IORedis from 'ioredis'

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

    function getRedisClient(): IORedis.Redis {
        return new IORedis(elfSetting.redisPort, elfSetting.redisHost)
    }

    export function handle<IReq, IRes>(method: string, handler: (req: IReq) => Promise<IRes>) {
        const redis = getRedisClient()
        redis.blpop(getServiceKey(method), 0 as any).then(async ([, reqText]) => {
            Log.i(`REQ:${method}`, reqText)
            const reqPack: IReqPack<IReq> = JSON.parse(reqText)
            const res = await handler(reqPack.params)
            redis.rpush(reqPack.key, JSON.stringify(res))
            redis.expire(reqPack.key, 1).catch(e => Log.e(e))
            handle(method, handler)
        })
    }

    export async function call<IReq, IRes>(method: string, params: IReq): Promise<IRes> {
        const redis = getRedisClient()
        const key = geneReqKey(), reqPack: IReqPack<IReq> = {method, params, key}
        redis.rpush(getServiceKey(method), JSON.stringify(reqPack))
        const [, resText] = await redis.blpop(key, 0 as any)
        return resText ? JSON.parse(resText) : null
    }
}

export * from './interface'