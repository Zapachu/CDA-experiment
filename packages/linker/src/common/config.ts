import {LogLevel} from './baseEnum'

export const config = {
    rootName: 'elf',
    apiPrefix: 'api',
    appPrefix: '',
    socketPath: '/elf/socket.io',
    logLevel: LogLevel.log,
    academusLoginRoute: '/login',
    cookieKey:{
        csrf:'_csrf'
    }
}