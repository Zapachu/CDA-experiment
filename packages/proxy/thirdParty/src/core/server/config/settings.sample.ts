export default {
    otreePort: 3070,
    qualtricsPort: 3071,
    wjxPort: 3072,
    qqwjPort: 3073,
    mongoUri: process.env.MONGODB || 'mongodb://127.0.0.1:27017/academy',
    mongoUser: '',
    mongoPass: '',
    redisHost: process.env.REDIS || '127.0.0.1',
    redisPort: 6379,
    sessionSecret: process.env.SESSION_SECRET || 'sessionsecret',
    academusApiGateway: 'http://127.0.0.1/apiv1',
    // game rpc
    pythonRobotUri: process.env.PYTHON_ROBOT_URI || '127.0.0.1:50051',
    academusServicesUri: process.env.ACADEMUS_ROBOT_URI || '127.0.0.1:53008',
    elfGameServiceUri: '127.0.0.1:54000',
    // otree rpc
    localOtreePhaseServiceUri: '127.0.0.1:53070',
    localOtreeRootUrl: 'http://127.0.0.1:3070',

    // Otree Phase Part
    otreeServerRootUrl: 'http://127.0.0.1:3005',
    otreePhaseServerPrefix: 'http://127.0.0.1:3070',
    otreeRootName: 'otreePhase',

    // qualtrics rpc
    localQualtricsServiceUri: '127.0.0.1:53071',
    localQualtricsRootUrl: 'http://127.0.0.1:3071',

    // Qualtrics Phase Part
    qualtricsServerRootUrl: 'https://survey.qualtrics.com',
    qualtricsPhaseServerPrefix: 'http://127.0.0.1:3071',
    qualtricsRootName: 'qualtricsPhase',

    // 问卷星 rpc
    localWjxServiceUri: '127.0.0.1:53072',
    localWjxRootUrl: 'http://127.0.0.1:3072',

    // 问卷星 Phase Part
    WjxServerRootUrl: 'https://www.wjx.cn',
    WjxPhaseServerPrefix: 'http://127.0.0.1:3072',
    WjxRootName: 'wjxPhase',

    // 腾讯问卷 rpc
    localqqwjServiceUri: '127.0.0.1:53073',
    localqqwjRootUrl: 'http://127.0.0.1:3073',

    // 腾讯问卷 Phase Part
    qqwjServerRootUrl: 'https://wj.qq.com',
    qqwjPhaseServerPrefix: 'http://127.0.0.1:3073',
    qqwjRootName: 'qqwjPhase'
}