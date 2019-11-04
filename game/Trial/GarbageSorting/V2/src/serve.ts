import {resolve} from 'path';
import {Server} from '@bespoke/server';
import {RobotServer} from '@bespoke/robot';
import {Logic, Robot} from './Logic';
import {namespace} from './config';

Server.start(namespace, Logic, resolve(__dirname, '../dist'));
RobotServer.start(namespace, Robot);
