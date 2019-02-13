require('../../../../registerTsconfig')
import {Server} from '@dev/server'
import {namespace} from './config'
import Controller from './Controller'
import * as path from 'path'
import {setting} from './setting'

Server.start({
    namespace,
    port: +process.env.PORT || setting.port,
    rpcPort: +process.env.RPC_PORT || setting.rpcPort,
    getClientPath: () => require(`../dist/${namespace}.json`)[`${namespace}.js`],
    staticPath: path.resolve(__dirname, '../dist'),
    qCloudSMS: {
        appId: '---',
        appKey: '---',
        smsSign: '---',
        templateId: {
            verifyCode: ''
        }
    },
    proxyService: {
        host: '127.0.0.1',
        port: 58888
    }
}, {Controller})