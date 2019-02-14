import * as dateFormat from 'dateformat'
import {config, ICoreSetting} from '@dev/common'

export const coreSetting: ICoreSetting = {
    host: '127.0.0.1',
    mongoUri: 'mongodb://127.0.0.1:27017/academy',
    mongoUser: '',
    mongoPass: '',
    redisHost: '127.0.0.1',
    redisPort: 6379,
    sessionSecret: 'sessionsecret',
    proxyService: {
        host: '127.0.0.1',
        port: 58888
    },
    academusServiceUri: '127.0.0.1:53008',
    pythonRobotUri: '127.0.0.1:54001',
    elfGameServiceUri: '127.0.0.1:54002',
    adminMobileNumbers: ['13000000000'],
    qiNiu: {
        upload: {
            ACCESS_KEY: 'Cgc7------------------------------------',
            SECRET_KEY: 'QGyn------------------------------------',
            bucket: 'notes',
            path: `${config.rootName}/${dateFormat(Date.now(), 'yyyymmddHHMM')}`
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
    }
}