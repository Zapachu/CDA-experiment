import {startServer} from '../../core/server/server'
import {namespace} from './config'
import Controller from './Controller'

startServer(namespace, {Controller})