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
    //endregion
    //region bespoke
    proxyOrigin:'http://127.0.0.1',
    adminMobileNumbers: ['13000000000'],
    //endregion
    //region thirdPartyPhaseProxy
    // qualtrics
    qualtricsPort: 3071,
    qualtricsProxy: 'http://127.0.0.1:3071',
    // 问卷星
    wjxPort: 3072,
    wjxProxy: 'http://127.0.0.1:3072',
    // 腾讯问卷
    qqwjPort: 3073,
    qqwjProxy: 'http://127.0.0.1:3073',
    //endregion
    //region other
    academusServiceUri: '127.0.0.1:53008',
    adminServiceUri: '127.0.0.1:53010'
    //endregion
}
