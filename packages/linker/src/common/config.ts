import {LogLevel} from './baseEnum'

export const config = {
    rootName: 'elfGame',
    apiPrefix: 'api',
    appPrefix: 'app',
    socketPath: '/elfGame/socket.io',
    logLevel: LogLevel.log,
    academusLoginRoute: '/login',
    cookieKey:{
        csrf:'_csrf'
    }
}