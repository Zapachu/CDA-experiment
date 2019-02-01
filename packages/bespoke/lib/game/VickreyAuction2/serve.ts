import {Server} from '../../core/server/server'
import {namespace} from './config'
import Controller from './Controller'
import * as path from 'path'

Server.start({
    namespace,
    getClientPath: () => require(`./dist/${namespace}.json`)[`${namespace}.js`],
    staticPath: path.resolve(__dirname, 'dist'),
    qCloudSMS: {
        appId: '---',
        appKey: '---',
        smsSign: '---',
        templateId: {
            verifyCode: ''
        }
    }
}, {Controller})