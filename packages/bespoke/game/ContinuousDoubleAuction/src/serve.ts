import {resolve} from 'path'
import {baseEnum} from 'bespoke-common'
import {Server} from 'bespoke-server'
import {namespace} from './config'
import Controller from './Controller'
import Robot from './Robot'

Server.start({
    namespace,
    port: +process.env.PORT,
    rpcPort: +process.env.RPC_PORT,
    staticPath: resolve(__dirname, '../dist')
}, {Controller, Robot, sncStrategy:baseEnum.SyncStrategy.msgPack})
