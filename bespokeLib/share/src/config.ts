export const config = {
    rootName: 'bespoke',
    apiPrefix: 'api',
    socketPath: namespace => `/bespoke/${namespace}/socket.io`,
    devPort:{
      client:8080,
      server:8081
    },
    minMoveInterval: 250,
    vcodeLifetime: 60
}
