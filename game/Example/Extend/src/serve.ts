import {resolve} from 'path'
import {namespace} from './config'
import {Server} from '@bespoke/server'
import {Logic} from './Logic'

Server.start(namespace, Logic, resolve(__dirname, '../static'))