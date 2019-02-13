import * as dateFormat from 'dateformat'
import {namespace} from './config'

export const setting = {
    port: 3009,
    rpcPort: 53009,
    mongoUri: process.env.MONGODB || 'mongodb://127.0.0.1:27017/academy',
    mongoUser: '',
    mongoPass: '',
    redisHost: process.env.REDIS || '127.0.0.1',
    redisPort: 6379,
    sessionSecret: process.env.SESSION_SECRET || 'sessionsecret',
    //region rpc
    academusServiceUri: '127.0.0.1:53008',
    pythonRobotUri: '127.0.0.1:50051',
    elfGameServiceUri: '127.0.0.1:54000',
    localServiceUri: '127.0.0.1:53009',
    //endregion
    localRootUrl: 'http://127.0.0.1',
    adminMobileNumbers: {
        13000000000: ['ContinuousDoubleAuction', 'CognitiveReaction', 'CardGame', 'Blockade', 'VickreyAuction2']
    },
    qCloudSMS: {
        appId: '---',
        appKey: '---',
        smsSign: '---',
        templateId: {
            verifyCode: ''
        }
    },
    qiNiu: {
        upload: {
            ACCESS_KEY: 'Cgc7------------------------------------',
            SECRET_KEY: 'QGyn------------------------------------',
            bucket: 'notes',
            path: `${namespace}/${dateFormat(Date.now(), 'yyyymmddHHMM')}`
        },
        download: {
            jsDomain: 'http://--------.bkt.clouddn.com'
        }
    },
    mail: {
        smtpHost: '-----.mailjet.com',
        smtpUsername: '',
        smtpPassword: ''
    }
}