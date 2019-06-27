import {colorConsole, dailyfile} from 'tracer'

export enum LogLevel {log, trace, debug, info, warn, error, fatal}

export class Log {
    private static logger = colorConsole()

    static get l(){
        return this.logger.log
    }

    static get i(){
        return this.logger.info
    }
    static get d(){
        return this.logger.debug
    }
    static get w(){
        return this.logger.warn
    }
    static get e(){
        return this.logger.error
    }

    static setLogPath(logPath: string, level: LogLevel) {
        this.logger = dailyfile({
            level: level.toString(),
            root: logPath
        })
        console.log(`当前为生成环境,日志记录于:${logPath}`)
    }
}