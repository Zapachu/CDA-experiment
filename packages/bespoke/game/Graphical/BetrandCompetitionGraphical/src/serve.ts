import {resolve} from 'path'
import {Server} from '@bespoke/core'
import Controller from './Controller'
import {namespace} from './config'

Server.start(namespace, Controller, resolve(__dirname, '../dist'))
