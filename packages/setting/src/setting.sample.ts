const d = new Date(),
    timestamp = `${d.getFullYear()}${d.getMonth()}${d.getDate()}${d.getHours()}${d.getMinutes()}`
export default {
    //region common
    mongoUri: 'mongodb://127.0.0.1:27017/academy',
    mongoUser: '',
    mongoPass: '',
    redisHost: '127.0.0.1',
    redisPort: 6379,
    sessionSecret: 'sessionsecret',
    qiNiu: {
        upload: {
            ACCESS_KEY: 'Cgc7------------------------------------',
            SECRET_KEY: 'QGyn------------------------------------',
            bucket: 'notes',
            path: timestamp
        },
        download: {
            jsDomain: 'http://--------.bkt.clouddn.com'
        }
    },
    qCloudSMS: {
        appId: '---',
        appKey: '---',
        smsSign: '---',
        templateId: {
            verifyCode: ''
        }
    },
    mail: {
        smtpHost: '-----.mailjet.com',
        smtpUsername: '',
        smtpPassword: ''
    },
    ocpApim: {
        gateWay: 'https://api.cognitive.azure.cn/face/v1.0/detect',
        subscriptionKey: '4210--------------------'
    },
    //endregion
    //region linker
    linkerGatewayHost: '127.0.0.1',
    linkerPort: 4000,
    linkerServiceUri: '127.0.0.1:54000',
    //endregion
    //region bespoke
    proxyService: {
        host: 'http://127.0.0.1',//https://bespoke.ancademy.org
        port: 4001,
        rpcHost: '127.0.0.1',
        rpcPort: 54001
    },
    adminMobileNumbers: ['13000000000'],
    pythonRobotUri: '127.0.0.1:54001',
    //endregion
    //region thirdPartyPhaseProxy
    // qualtrics
    qualtricsPort: 3071,
    qualtricsRpc: '127.0.0.1:53071',
    qualtricsProxy: 'http://127.0.0.1:3071',
    // 问卷星
    wjxPort: 3072,
    wjxRpc: '127.0.0.1:53072',
    wjxProxy: 'http://127.0.0.1:3072',
    // 腾讯问卷
    qqwjPort: 3073,
    qqwjRpc: '127.0.0.1:53073',
    qqwjProxy: 'http://127.0.0.1:3073',
    //endregion
    //region other
    academusServiceUri: '127.0.0.1:53008'
    //endregion
}
