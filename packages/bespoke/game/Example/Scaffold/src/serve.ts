import {resolve} from 'path'
import {namespace} from './config'
import {Server} from '@bespoke/core'
import {Controller} from './Controller'

Server.start(namespace, Controller, resolve(__dirname, '../dist'))