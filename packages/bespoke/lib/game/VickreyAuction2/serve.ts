import {startServer} from '../../core/server/server'
import {registerGameLogic} from 'server-vendor'
import {namespace} from './config'
import Controller from './Controller'

startServer({namespace})
registerGameLogic(namespace, {
    Controller
})