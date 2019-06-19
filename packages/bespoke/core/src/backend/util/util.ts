import {config, IGameSetting} from 'bespoke-core-share'
import {elfSetting} from 'elf-setting'
import {colorConsole, dailyfile} from 'tracer'
import {resolve} from 'path'
import {readFileSync} from 'fs'
import * as objHash from 'object-hash'
import {NetworkInterfaceInfo, networkInterfaces} from 'os'
import {redisClient} from 'elf-protocol'
import {CONFIG} from './config'

export class Token {
    private static geneCheckCode(chars: string[]) {
        return String.fromCharCode(chars.map(c => c.charCodeAt(0)).reduce((pre, cur) => pre + cur) % 26 + 97)
    }

    static geneToken(obj: any): string {
        const token = objHash(obj, {algorithm: 'md5'})
        return this.geneCheckCode([...token]) + token
    }

    static checkToken(token: string): boolean {
        const [checkCode, ...chars] = token
        if (chars.length === 32 && checkCode === this.geneCheckCode(chars)) {
            return true
        }
        if (elfSetting.bespokeWithLinker) {
            return token.length === 32
        }
        chars.length === 32 ? Log.w(`Invalid Token: ${token}`) : null
        return false
    }
}

export function gameId2PlayUrl(gameId: string, keyOrToken?: string): string {
    const query = keyOrToken ? `?token=${Token.checkToken(keyOrToken) ? keyOrToken : Token.geneToken(keyOrToken)}` : ''
    return `${getOrigin()}/${config.rootName}/${Setting.namespace}/play/${gameId}${query}`
}

export function getOrigin(): string {
    return elfSetting.bespokeWithProxy ? elfSetting.proxyOrigin :
        `http://${Setting.ip}:${elfSetting.bespokeHmr ? config.devPort.client : Setting.port}`
}

export function heartBeat(key: string, value: string, seconds: number = CONFIG.heartBeatSeconds) {
    (async function foo() {
        await redisClient.setex(key, seconds + 1, value)
        setTimeout(foo, seconds * 1e3)
    })()
}

export namespace Log {
    let logger = colorConsole()

    export const l = logger.log
    export const i = logger.info
    export const d = logger.debug
    export const w = logger.warn
    export const e = logger.error

    export function init(logPath: string) {
        if (elfSetting.inProductEnv) {
            logger = dailyfile({
                level: CONFIG.logLevel.toString(),
                root: logPath
            })
            console.log(`当前为生成环境,日志记录于:${logPath}`)
        } else {
            this.l('当前为开发环境,短信/邮件发送、游戏状态持久化等可能受影响')
        }
    }
}

export class Setting {
    static namespace: string
    static staticPath: string
    private static _ip: string
    private static _port: number

    static get ip() {
        return this._ip
    }

    static get port() {
        return this._port
    }

    static setPort(port: number) {
        this._port = port
        Log.i(`Listening on port ${port}`)
    }

    static init(setting: IGameSetting) {
        this.namespace = setting.namespace
        this.staticPath = setting.staticPath
        this._port = setting.port || (elfSetting.inProductEnv ? 0 : config.devPort.server)
        Log.init(setting.logPath || resolve(setting.staticPath, '../log'))
        Object.values<NetworkInterfaceInfo[]>(networkInterfaces()).forEach(infos => {
            infos.forEach(({family, internal, address}) => {
                if (family === 'IPv4' && !internal) {
                    this._ip = address
                }
            })
        })
    }

    static getClientPath(): string {
        const {namespace} = this
        return elfSetting.bespokeHmr ?
            `http://localhost:${config.devPort.client}/${config.rootName}/${namespace}/static/${namespace}.js` :
            JSON.parse(readFileSync(resolve(this.staticPath, `${namespace}.json`)).toString())[`${namespace}.js`]
    }
}
