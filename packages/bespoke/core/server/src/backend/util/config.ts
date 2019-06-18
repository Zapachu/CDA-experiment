enum LogLevel {log, trace, debug, info, warn, error, fatal}

export const CONFIG = {
    shareCodeLifeTime: 3 * 24 * 60 * 60,
    memoryCacheLifetime: 3 * 60 * 1000,
    heartBeatSeconds: 10,
    historyGamesListSize: 12,
    logLevel: LogLevel.log
}