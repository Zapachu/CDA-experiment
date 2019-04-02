import {resolve} from 'path'
import {Server} from 'bespoke-server'
import Controller from './Controller'
import Robot from './Robot'

Server.start({
    staticPath: resolve(__dirname, '../dist'),
}, {Controller, Robot})
