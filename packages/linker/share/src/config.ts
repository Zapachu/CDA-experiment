export const config = {
    rootName: 'elf',
    apiPrefix: 'api',
    socketPath: '/elf/socket.io',
    academus: {
        route: {
            prefix: '',
            login: '/login',
            profileMobile:'/profile/mobile',
            join: '/subject/fastJoin',
            home:(orgCode, gameId) => `/org/${orgCode}/task/game/item/${gameId}`
        }
    }
}
