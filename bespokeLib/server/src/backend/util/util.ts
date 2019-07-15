import {config, IStartOption} from '@bespoke/share'
import {elfSetting} from '@elf/setting'
import {Log, NetWork, Token} from '@elf/util'
import {resolve} from 'path'
import {existsSync, readFileSync} from 'fs'
import {redisClient} from '@elf/protocol'
import {CONFIG} from './config'

export function gameId2PlayUrl(gameId: string, keyOrToken?: string): string {
    const query = keyOrToken ? `?token=${Token.checkToken(keyOrToken) ? keyOrToken : Token.geneToken(keyOrToken)}` : ''
    return `${getOrigin()}/${config.rootName}/${Setting.namespace}/play/${gameId}${query}`
}

export function getOrigin(): string {
    return elfSetting.bespokeWithProxy ? elfSetting.proxyOrigin :
        `http://${Setting.ip}:${elfSetting.bespokeHmr ? config.devPort.client : Setting.port}`
}

export function heartBeat(key: string, getValue: () => string, seconds: number = CONFIG.heartBeatSeconds) {
    (async function foo() {
        await redisClient.setex(key, seconds + 1, getValue())
        setTimeout(foo, seconds * 1e3)
    })()
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

    static init(namespace: string, staticPath: string, startOption: IStartOption) {
        this.namespace = namespace
        this.staticPath = staticPath
        this._ip = NetWork.getIp()
        this._port = startOption.port || (elfSetting.inProductEnv ? 0 : config.devPort.server)
        elfSetting.inProductEnv || Log.d('当前为开发环境,短信/邮件发送、游戏状态持久化等可能受影响')
        // Log.setLogPath(startOption.logPath || resolve(staticPath, '../log'), LogLevel.log) 由pm2管理日志
    }

    static getClientPath(): string {
        const {namespace} = this
        const manifestPath = resolve(this.staticPath, `${namespace}.json`)
        if (!existsSync(manifestPath)) {
            return ''
        }
        return elfSetting.bespokeHmr ?
            `http://localhost:${config.devPort.client}/${config.rootName}/${namespace}/static/${namespace}.js` :
            JSON.parse(readFileSync(manifestPath).toString())[`${namespace}.js`]
    }
}
