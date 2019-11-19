import { resolve } from 'path'
import { Server } from '@bespoke/server'
import Controller from './Controller'
import { namespace } from './config'

Server.start(namespace, Controller, resolve(__dirname, '../dist'))
