import {resolve} from 'path'
import {Server} from 'bespoke-server'
import {namespace} from './config'
import Controller from './Controller'

Server.start({
    namespace,
    port: +process.env.PORT,
    rpcPort: +process.env.RPC_PORT,
    staticPath: resolve(__dirname, '../dist'),
}, {Controller})
