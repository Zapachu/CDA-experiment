import {resolve} from 'path'
import {namespace} from './config'
import {Server} from 'bespoke-server'
import Controller from './Controller'
import Robot from './Robot'

Server.start(
    {namespace, staticPath: resolve(__dirname, '../dist')},
    {Controller, Robot}
)
