import {config, baseEnum, ISetting} from '@dev/common'
import {coreSetting} from '../config/setting.sample'
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
    const {proxyService} = setting
    return `http://${proxyService.host}:${proxyService.port}/${config.rootName}/${namespace}/play/${phaseId}`
}

//region setting

export const setting: Readonly<(Partial<ISetting>)> = coreSetting

export function initSetting(gameSetting: ISetting) {
    const {namespace, staticPath} = gameSetting
    gameSetting.port = gameSetting.port || 0
    gameSetting.getClientPath = gameSetting.getClientPath || ((): string => {
        const {[`${namespace}.js`]: clientPath} = JSON.parse(readFileSync(resolve(staticPath, `${namespace}.json`)).toString())
        return clientPath
    })
    Object.assign(setting, gameSetting)
    setting.qiNiu.upload.path += `/${namespace}`
}

//endregion