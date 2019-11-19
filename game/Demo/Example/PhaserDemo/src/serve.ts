import { resolve } from 'path'
import { Server } from '@bespoke/server'
import Logic from './Logic'
import { namespace } from './config'

Server.start(namespace, Logic, resolve(__dirname, '../dist'))
