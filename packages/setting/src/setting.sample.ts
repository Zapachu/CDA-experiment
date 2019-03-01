import {IElfSetting} from './interface'

const d = new Date(),
    timestamp = `${d.getFullYear()}${d.getMonth()}${d.getDate()}${d.getHours()}${d.getMinutes()}`
export const elfSetting = <IElfSetting>{
    host: '127.0.0.1',
    mongoUri: 'mongodb://127.0.0.1:27017/academy',
    mongoUser: '',
    mongoPass: '',
    redisHost: '127.0.0.1',
    redisPort: 6379,
    sessionSecret: 'sessionsecret',
    proxyService: {
        host: '127.0.0.1',
        port: 8888,
        rpcPort: 58888
    },
    academusServiceUri: '127.0.0.1:53008',
    pythonRobotUri: '127.0.0.1:54001',
    elfGameServiceUri: '127.0.0.1:54000',
    adminMobileNumbers: ['13000000000'],
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
    }
}