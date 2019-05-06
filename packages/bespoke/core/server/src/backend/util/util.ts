import {config, IGameSetting} from 'bespoke-common'
import {elfSetting} from 'elf-setting'
import {colorConsole, dailyfile} from 'tracer'
import {resolve} from 'path'
import {readFileSync} from 'fs'
import * as objHash from 'object-hash'

export class Token {
    private static geneCheckCode(chars: string[]) {
        return String.fromCharCode(chars.map(c => c.charCodeAt(0)).reduce((pre, cur) => pre + cur) % 26 + 97)
    }

    static geneToken(obj: any): string {
        const token = objHash(obj, {algorithm: 'md5'})
        return this.geneCheckCode([...token]) + token
    }

    static checkToken(token: string): boolean {
        if (elfSetting.bespokeWithLinker) {
            return true
        }
        const [checkCode, ...chars] = token
        return chars.length === 32 && checkCode === this.geneCheckCode(chars)
    }
}

export function elfPhaseId2PlayUrl(namespace: string, phaseId: string): string {
    const {proxyService: {host, port}} = elfSetting
    return `${host.startsWith('http') ? host : `http://${host}:${port}`}/${config.rootName}/${namespace}/play/${phaseId}`
}

export namespace Log {
    let logger = colorConsole()

    export const l = (...args) => logger.log(...args)
    export const i = (...args) => logger.info(...args)
    export const d = (...args) => logger.debug(...args)
    export const w = (...args) => logger.warn(...args)
    export const e = (...args) => logger.error(...args)

    export function init(logPath: string) {
        if (elfSetting.inProductEnv) {
            logger = dailyfile({
                level: config.logLevel.toString(),
                root: logPath
            })
            console.log(`当前为生成环境,日志记录于:${logPath}`)
        } else {
            this.l('当前为开发环境,短信/邮件发送、游戏状态持久化等可能受影响')
        }
    }
}

export class Setting {
    static namespace:string
    static staticPath: string
    private static _port: number
    private static _rpcPort: number

    static get port() {
        return this._port
    }

    static get rpcPort() {
        return this._rpcPort
    }

    static setPort(port: number) {
        this._port = port
        Log.i(`Listening on port ${port}`)
    }

    static setRpcPort(rpcPort: number) {
        this._rpcPort = rpcPort
        Log.i(`Serving on rpcPort ${rpcPort}`)
    }

    static init(setting: IGameSetting) {
        this.namespace = setting.namespace
        this.staticPath = setting.staticPath
        this._port = setting.port || (elfSetting.inProductEnv ? 0 : config.devPort.server)
        this._rpcPort = setting.rpcPort || 0
        Log.init(setting.logPath || resolve(setting.staticPath, '../log'))
    }

    static getClientPath(): string {
        const {namespace} = this
        return elfSetting.bespokeHmr ?
            `http://localhost:${config.devPort.client}/${config.rootName}/${namespace}/static/${namespace}.js` :
            JSON.parse(readFileSync(resolve(this.staticPath, `${namespace}.json`)).toString())[`${namespace}.js`]
    }
}
