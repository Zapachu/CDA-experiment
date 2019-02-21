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
    otreePort: 3070,
    localOtreePhaseServiceUri: '127.0.0.1:53070',
    localOtreeRootUrl: 'http://127.0.0.1:3070',
    otreeServerRootUrl: 'http://127.0.0.1:8000',
    otreeRootName: 'otreePhase',

    // qualtrics
    qualtricsPort: 3071,
    localQualtricsServiceUri: '127.0.0.1:53071',
    localQualtricsRootUrl: 'http://127.0.0.1:3071',
    qualtricsServerRootUrl: 'https://cessoxford.eu.qualtrics.com',
    qualtricsRootName: 'qualtricsPhase',

    // 问卷星
    wjxPort: 3072,
    localWjxServiceUri: '127.0.0.1:53072',
    localWjxRootUrl: 'http://127.0.0.1:3072',
    WjxServerRootUrl: 'https://www.wjx.cn',
    WjxRootName: 'wjxPhase',

    // 腾讯问卷 rpc
    qqwjPort: 3073,
    localqqwjServiceUri: '127.0.0.1:53073',
    localqqwjRootUrl: 'http://127.0.0.1:3073',
    qqwjServerRootUrl: 'https://wj.qq.com',
    qqwjRootName: 'qqwjPhase'
}