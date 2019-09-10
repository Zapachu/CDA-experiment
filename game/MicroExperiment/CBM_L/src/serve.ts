import {resolve} from 'path';
import {namespace} from './config';
import {gameId2PlayUrl, RedisCall, Server} from '@bespoke/server';
import Controller from '../../CBM/src/Controller';
import Robot from '../../CBM/src/Robot';
import {NCreateParams, Phase} from '@micro-experiment/share';
import {Trial} from '@elf/protocol';
import {RobotServer} from '@bespoke/robot';

Server.start(namespace, Controller, resolve(__dirname, '../dist'));

RobotServer.start(namespace, Robot);

RedisCall.handle<Trial.Create.IReq<NCreateParams.CBM>, Trial.Create.IRes>(Trial.Create.name(namespace), async params => {
    const gameId = await Server.newGame<NCreateParams.CBM>({
        title: `${Phase.CBM_L}:${new Date().toUTCString()}`,
        params
    });
    return {playUrl: gameId2PlayUrl(gameId)};
});