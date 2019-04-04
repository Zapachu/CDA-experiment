import {LogLevel} from './baseEnum'

export const config = {
    rootName: 'elf',
    apiPrefix: 'api',
    socketPath: '/elf/socket.io',
    logLevel: LogLevel.log,
    academus: {
        route: {
            prefix: '/v5',
            login: '/login',
            share: gameId => `/share?id=${gameId}&type=10`,
            join: '/subject/fastJoin',
            member: (orgCode, gameId) => `/org/${orgCode}/task/game/item/members/${gameId}`
        }
    },
    cookieKey: {
        csrf: '_csrf'
    }
}
