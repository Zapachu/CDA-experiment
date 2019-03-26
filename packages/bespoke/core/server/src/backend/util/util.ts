import {config, baseEnum, IGameSetting} from 'bespoke-common'
import {elfSetting} from 'elf-setting'
import {colorConsole, dailyfile} from 'tracer'
import {resolve} from 'path'
import {readFileSync} from 'fs'
import * as objHash from 'object-hash'

export const inProductEnv = process.env.NODE_ENV === baseEnum.Env.production
export const webpackHmr = process.env.HMR === 'true'

const {log: l, info: i, debug: d, warn: w, error: e} = (inProductEnv ? dailyfile : colorConsole)({
    level: config.logLevel.toString(),
    root: resolve(__dirname, '../../../../log')
} as any)

export const Log = {l, d, i, w, e}

if (!inProductEnv) {
    Log.w('当前为开发环境,短信/邮件发送、游戏状态持久化等可能受影响')
}

export class Hash {
    static hashObj(obj: any): string {
        return objHash(obj, {algorithm: 'md5'})
    }

    static isHash(hash: string): boolean {
        return !!hash.match(/^\w{32}$/)
    }
}

export function elfPhaseId2PlayUrl(namespace: string, phaseId: string): string {
    const {proxyService:{host,port}} = elfSetting
    return `${host.startsWith('http')?host:`http://${host}:${port}`}/${config.rootName}/${namespace}/play/${phaseId}`
}

export class Setting {
    static staticPath:string

    static init(setting:IGameSetting){
        this.staticPath = setting.staticPath
    }

    static getClientPath():string {
        const {bespokeNamespace} = elfSetting
        const {[`${bespokeNamespace}.js`]: clientPath} = JSON.parse(readFileSync(resolve(this.staticPath, `${bespokeNamespace}.json`)).toString())
        return clientPath
    }
}
