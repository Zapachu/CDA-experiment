import {LogLevel} from './baseEnum'

export const config = {
    rootName: 'elf',
    apiPrefix: 'api',
    appPrefix: 'app',
    socketPath: '/elf/socket.io',
    logLevel: LogLevel.log,
    academusLoginRoute: '/login',
    cookieKey:{
        csrf:'_csrf'
    }
}