import {IElfSetting} from './interface'

const d = new Date(),
    timestamp = `${d.getFullYear()}${d.getMonth()}${d.getDate()}${d.getHours()}${d.getMinutes()}`
export const elfSetting: IElfSetting = {
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
    host: '127.0.0.1',//game宿主机内网默认IP，可由game传入配置覆盖
    proxyService: {
        host: '127.0.0.1',
        port: 4001,
        rpcPort: 54001
    },
    adminMobileNumbers: ['13000000000'],
    pythonRobotUri: '127.0.0.1:54001',
    //endregion
    //region thirdPartyPhaseProxy
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
    // 腾讯问卷
    qqwjPort: 4005,
    qqwjRpc: '127.0.0.1:54005',
    qqwjProxy: 'http://127.0.0.1:4005',
    qqwjServer: 'https://wj.qq.com',
    qqwjStaticNamespace: 'qqwjPhase',
    //endregion
    //region other
    academusServiceUri: '127.0.0.1:53008'
    //endregion
}
