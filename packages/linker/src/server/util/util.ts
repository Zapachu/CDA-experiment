import {config} from '@common'
import * as objHash from 'object-hash'
import {elfSetting} from '@elf/setting'

export const webpackHmr = process.env.HMR === 'true'

export class Hash {
    static hashObj(obj: any): string {
        return objHash(obj, {algorithm: 'md5'})
    }

    static isHash(hash: string): boolean {
        return !!hash.match(/^\w{32}$/)
    }
}

export function buildPlayUrl(gameId: string, playerToken: string) {
    const {linkerGatewayHost: host, linkerPort: port} = elfSetting
    return `${host.startsWith('http') ? host : `http://${host}:${port}`}/${config.rootName}/play/${gameId}?token=${playerToken}`
}
