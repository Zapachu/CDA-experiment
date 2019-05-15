import {resolve} from 'path'
import {Server} from 'bespoke-server'
import Controller from './Controller'
import {namespace} from './config'
import Robot from './Robot'

Server.start({
    namespace,
    staticPath: resolve(__dirname, '../dist')
}, {Controller, Robot})
