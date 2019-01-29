import {Server} from '../../core/server/server'
import {namespace} from './config'
import Controller from './Controller'

Server.start(namespace, {Controller})