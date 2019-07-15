import {Linker, RedisCall, redisClient} from '@elf/protocol'
import {readFileSync} from 'fs'
import {resolve} from 'path'

export function withLinker(namespace: string, proxyOrigin: string, getUrlByNamespace: (req: Linker.Create.IReq) => Promise<string>, jsUrl?: string) {
    RedisCall.handle<Linker.Create.IReq, Linker.Create.IRes>(Linker.Create.name(namespace), async req => {
        return {playUrl: await getUrlByNamespace(req)}
    })
    setInterval(() => {
        const manifest = JSON.parse(readFileSync(resolve(__dirname, '../../../dist/manifest.json')).toString())
        const regPhase: Linker.HeartBeat.IHeartBeat = {
            namespace: namespace,
            jsUrl: jsUrl || `${proxyOrigin}${manifest[`${namespace}.js`]}`
        }
        redisClient.setex(Linker.HeartBeat.key(namespace), Linker.HeartBeat.intervalSeconds + 1, JSON.stringify(regPhase)).catch(e => console.log(e))
    }, Linker.HeartBeat.intervalSeconds)
}