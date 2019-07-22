import {resolve} from 'path'
import {namespace} from './config'
import {Server} from '@bespoke/server'
import {RobotServer} from '@bespoke/robot'
import {Logic} from './Logic'
import {Robot} from './Robot'

Server.start(namespace, Logic, resolve(__dirname, '../static'))

RobotServer.start(namespace, Robot)