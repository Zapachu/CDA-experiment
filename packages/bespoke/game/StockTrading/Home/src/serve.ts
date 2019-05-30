import {resolve} from 'path'
import {Server} from 'bespoke-server'
import {namespace} from './config'
import Controller from './Controller'

Server.start(
    {namespace, staticPath: resolve(__dirname, '../dist')},
    {Controller}
)
