import {config, baseEnum, IQCloudSMS, IQiniuConfig} from '@dev/common'
import {colorConsole, dailyfile} from 'tracer'
import {resolve} from 'path'
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
    return `http://${setting.host}/${config.rootName}/${namespace}/play/${phaseId}`
}

//region setting
export interface ISetting {
    namespace: string
    host?: string
    port?: number
    rpcPort?: number
    independent?: boolean
    mongoUri?: string
    mongoUser?: string
    mongoPass?: string
    redisHost?: string
    redisPort?: number
    sessionSecret?: string
    //region RPC
    proxyService?: {
        host: string
        port: number
    }
    academusServiceUri?: string
    pythonRobotUri?: string
    elfGameServiceUri?: string
    localServiceUri?: string
    //endregion
    qCloudSMS?: IQCloudSMS
    qiNiu?: IQiniuConfig
    mail?: {
        smtpHost: string
        smtpUsername: string
        smtpPassword: string
    }
    adminMobileNumbers?: Array<string>
    getClientPath: () => string
    staticPath: string
}

export const setting: Readonly<(Partial<ISetting>)> = {
    host: '127.0.0.1',
    port: 0,
    mongoUri: 'mongodb://127.0.0.1:27017/academy',
    mongoUser: '',
    mongoPass: '',
    redisHost: '127.0.0.1',
    redisPort: 6379,
    sessionSecret: 'sessionsecret',
    adminMobileNumbers: ['13000000000']
}

export function initSetting(gameSetting: ISetting) {
    Object.assign(setting, gameSetting)
}

//endregion