export const config = {
    rootName: 'bespoke',
    apiPrefix: 'api',
    socketPath: namespace => `/bespoke/${namespace}/socket.io`,
    devPort:{
      client:8080,
      server:8081
    },
    minMoveInterval: 500,
    vcodeLifetime: 60,
    cookieKey: {
        csrf: '_csrf'
    }
}