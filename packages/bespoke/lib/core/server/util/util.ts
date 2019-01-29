import {config, baseEnum} from '@common'
import {colorConsole, dailyfile} from 'tracer'
import {resolve} from 'path'
import * as objHash from 'object-hash'
import devSetting from '../config/setting.dev'
import * as fs from 'fs'
import * as path from 'path'

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

export function elfPhaseId2PlayUrl(phaseId: string): string {
    return `${setting.localRootUrl}/${config.rootName}/play/${phaseId}`
}

export function readManifest(relativePath: string) {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, relativePath)).toString())
}

export const setting = ((): typeof devSetting => {
    switch (process.env.NODE_ENV) {
        case baseEnum.Env.production:
            return require('../config/setting').default
        case baseEnum.Env.testing:
            return require('../config/setting.test').default
        default:
            return devSetting
    }
})()

export type TServerOption = Partial<typeof devSetting>