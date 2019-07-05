import {resolve} from 'path'
import {namespace} from './config'
import {Server} from '@bespoke/server'
import {Controller} from './Controller'

Server.start(namespace, Controller, resolve(__dirname, '../dist'))