/**
 * Description : 非敏感配置信息
 */
import {LogLevel, Language} from './baseEnum'

export const config = {
    rootName: 'bespoke',
    apiPrefix: 'api',
    socketPath: namespace => `/bespoke/${namespace}/socket.io`,
    memoryCacheLifetime: 3 * 60 * 1000,
    minMoveInterval: 500,
    historyGamesListSize: 12,
    shareCodeLifeTime: 3 * 24 * 60 * 60,
    vcodeLifetime: 60,
    gameRegisterInterval: 30000,
    logLevel: LogLevel.log,
    defaultLanguage: Language.en,
    cookieKey: {
        csrf: '_csrf'
    },
    buildManifest: {
        clientVendorLib: 'clientVendor',
        clientCoreLib: 'clientCore'
    }
}