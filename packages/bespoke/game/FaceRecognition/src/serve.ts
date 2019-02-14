require('../../../registerTsconfig')
import {Server} from '@dev/server'
import {namespace} from './config'
import Controller from './Controller'
import * as path from 'path'
import setting from './config/setting'

Server.start({
    namespace,
    port: +process.env.PORT || setting.port,
    rpcPort: +process.env.RPC_PORT || setting.rpcPort,
    staticPath: path.resolve(__dirname, '../dist'),
    getClientPath: () => require(`../dist/${namespace}.json`)[`${namespace}.js`]
}, {Controller})