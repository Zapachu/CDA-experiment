import {resolve} from 'path'
import {Server} from 'bespoke-server'
import Controller from './Controller'

Server.start({
    staticPath: resolve(__dirname, '../dist'),
}, {Controller})
