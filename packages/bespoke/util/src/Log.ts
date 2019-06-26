import {colorConsole, dailyfile} from 'tracer'

export namespace Log {
    export enum Level {log, trace, debug, info, warn, error, fatal}

    let logger = colorConsole()

    export const l = (...args)=>logger.log(...args)
    export const i = (...args)=>logger.info(...args)
    export const d = (...args)=>logger.debug(...args)
    export const w = (...args)=>logger.warn(...args)
    export const e = (...args)=>logger.error(...args)

    export function setLogPath(logPath: string, level: Level) {
        logger = dailyfile({
            level: level.toString(),
            root: logPath
        })
        console.log(`当前为生成环境,日志记录于:${logPath}`)
    }
}