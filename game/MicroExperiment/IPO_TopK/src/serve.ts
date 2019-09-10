import {resolve} from 'path';
import {gameId2PlayUrl, RedisCall, Server} from '@bespoke/server';
import Controller from '../../IPO_Median/src/Controller';
import {namespace} from './config';
import Robot from '../../IPO_Median/src/Robot';
import {NCreateParams} from '@micro-experiment/share';
import {Trial} from '@elf/protocol';
import {RobotServer} from '@bespoke/robot';

Server.start(namespace, Controller, resolve(__dirname, '../dist'));

RobotServer.start(namespace, Robot);

RedisCall.handle<Trial.Create.IReq<NCreateParams.IPO>, Trial.Create.IRes>(Trial.Create.name(namespace), async params => {
    const gameId = await Server.newGame<NCreateParams.IPO>({
        title: `${params.type}:${new Date().toUTCString()}`,
        params
    });
    return {playUrl: gameId2PlayUrl(gameId)};
});