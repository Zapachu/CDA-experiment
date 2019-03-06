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
    otreePort: 4002,
    otreeUser1: 'user001',
    localOtreePhaseServiceUri: '127.0.0.1:54002',
    localOtreeRootUrl: 'http://127.0.0.1:4002',
    otreeServerRootUrl: 'http://127.0.0.1:8000',
    otreeRootName: 'otreePhase',

    // qualtrics
    qualtricsPort: 4003,
    localQualtricsServiceUri: '127.0.0.1:54003',
    localQualtricsRootUrl: 'http://127.0.0.1:4003',
    qualtricsServerRootUrl: 'https://cessoxford.eu.qualtrics.com',
    qualtricsRootName: 'qualtricsPhase',

    // 问卷星
    wjxPort: 4004,
    localWjxServiceUri: '127.0.0.1:54004',
    localWjxRootUrl: 'http://127.0.0.1:4004',
    WjxServerRootUrl: 'https://www.wjx.cn',
    WjxRootName: 'wjxPhase',

    // 腾讯问卷 rpc
    qqwjPort: 4005,
    localqqwjServiceUri: '127.0.0.1:54005',
    localqqwjRootUrl: 'http://127.0.0.1:4005',
    qqwjServerRootUrl: 'https://wj.qq.com',
    qqwjRootName: 'qqwjPhase'
}
