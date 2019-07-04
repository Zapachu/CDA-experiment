import {NewPhase, PhaseReg, RedisCall, redisClient} from 'elf-protocol'
import * as objectHash from 'object-hash'
import {readFileSync} from 'fs'
import {resolve} from 'path'

export const gen32Token = (source) => {
    return objectHash(source, {algorithm: 'md5'})
}

export function withLinker(namespace: string, proxyOrigin: string, getUrlByNamespace: (req: NewPhase.IReq) => Promise<string>, jsUrl?: string) {
    RedisCall.handle<NewPhase.IReq, NewPhase.IRes>(NewPhase.name(namespace), async req => {
        return {playUrl: await getUrlByNamespace(req)}
    })
    setInterval(() => {
        const manifest = JSON.parse(readFileSync(resolve(__dirname, '../../../dist/manifest.json')).toString())
        const regPhase: PhaseReg.IRegInfo = {
            namespace: namespace,
            jsUrl: jsUrl || `${proxyOrigin}${manifest[`${namespace}.js`]}`
        }
        redisClient.setex(PhaseReg.key(namespace), PhaseReg.intervalSeconds + 1, JSON.stringify(regPhase)).catch(e => console.log(e))
    }, PhaseReg.intervalSeconds)
}