export const config = {
    rootName: 'elf',
    apiPrefix: 'api',
    socketPath: '/elf/socket.io',
    academus: {
        route: {
            prefix: '/v5',
            login: '/login',
            share: gameId => `/share?id=${gameId}&type=10`,
            join: '/subject/fastJoin',
            member: (orgCode, gameId) => `/org/${orgCode}/task/game/item/${gameId}/members`
        }
    },
    cookieKey: {
        csrf: '_csrf'
    }
}
