import {config} from '@common'
import {colorConsole, dailyfile} from 'tracer'
import * as objHash from 'object-hash'
import {elfSetting} from "elf-setting"
import {resolve} from "path"

export const inProductEnv = process.env.NODE_ENV === 'production'
export const webpackHmr = process.env.HMR === 'true'

const {log: l, info: i, debug: d, warn: w, error: e} = (inProductEnv ? dailyfile : colorConsole)({
    level: config.logLevel.toString(),
    root: resolve(__dirname, '../../../../log')
} as any)

export const Log = {l, d, i, w, e}

if (!inProductEnv) {
    Log.w('当前为开发环境')
}

export class Hash {
    static hashObj(obj: any): string {
        return objHash(obj, {algorithm: 'md5'})
    }

    static isHash(hash: string): boolean {
        return !!hash.match(/^\w{32}$/)
    }
}

export function buildPlayUrl(groupId:string, playerToken:string) {
    return `${elfSetting.linkerGatewayHost}/${config.rootName}/${config.appPrefix}/group/play/${groupId}?token=${playerToken}`
}
