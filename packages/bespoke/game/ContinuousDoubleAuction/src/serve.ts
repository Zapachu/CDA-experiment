require('../../../registerTsconfig')
import {Server} from '@dev/server'
import {namespace} from './config'
import Controller from './Controller'
import Robot from './Robot'
import * as path from 'path'
import {setting} from './setting'

Server.start({
    namespace,
    port: +process.env.PORT || setting.port,
    rpcPort: +process.env.RPC_PORT || setting.rpcPort,
    proxyService: setting.proxyService,
    staticPath: path.resolve(__dirname, '../dist'),
    getClientPath: () => require(`../dist/${namespace}.json`)[`${namespace}.js`]
}, {Controller, Robot})