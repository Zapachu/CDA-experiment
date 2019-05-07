import {resolve} from 'path'
import {Server} from 'bespoke-server'
import Controller from './Controller'
import Robot from './Robot'
import {namespace} from './config'

Server.start({
    namespace,
    staticPath: resolve(__dirname, '../dist'),
}, {Controller, Robot})
