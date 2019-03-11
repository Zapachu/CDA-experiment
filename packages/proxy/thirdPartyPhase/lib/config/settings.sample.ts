export default {
    mongoUri: process.env.MONGODB || 'mongodb://127.0.0.1:27017/academy',
    mongoUser: '',
    mongoPass: '',
    redisHost: process.env.REDIS || '127.0.0.1',
    redisPort: 6379,
    sessionSecret: process.env.SESSION_SECRET || 'sessionsecret',

    // game rpc
    elfGameServiceUri: '127.0.0.1:54000',

    // otree
    oTreePort: 4002,
    oTreeUser1: 'user001',
    oTreeRpc: '127.0.0.1:54002',
    oTreeProxy: 'http://127.0.0.1:4002',
    oTreeServer: 'http://127.0.0.1:8000',
    oTreeStaticPathNamespace: 'otreePhase',

    // qualtrics
    qualtricsPort: 4003,
    qualtricsRpc: '127.0.0.1:54003',
    qualtricsProxy: 'http://127.0.0.1:4003',
    qualtricsServer: 'https://cessoxford.eu.qualtrics.com',
    qualtricsStaticNamespace: 'qualtricsPhase',

    // 问卷星
    wjxPort: 4004,
    wjxRpc: '127.0.0.1:54004',
    wjxProxy: 'http://127.0.0.1:4004',
    wjxServer: 'https://www.wjx.cn',
    wjxStaticNamespace: 'wjxPhase',

    // 腾讯问卷 rpc
    qqwjPort: 4005,
    qqwjRpc: '127.0.0.1:54005',
    qqwjProxy: 'http://127.0.0.1:4005',
    qqwjServer: 'https://wj.qq.com',
    qqwjStaticNamespace: 'qqwjPhase'
}
