import {resolve} from 'path'
import {gameId2PlayUrl, RedisCall, Server} from '@bespoke/core'
import Controller from './Controller'
import Robot from './Robot'
import {ICreateParams, namespace} from './config'
import {CreateGame} from 'elf-protocol'
import {RobotServer} from '@bespoke/robot'

Server.start(namespace, Controller, resolve(__dirname, '../dist'))

RobotServer.start(namespace, Robot)

RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(
  CreateGame.name(namespace),
  async ({ keys }) => {
    const gameId = await Server.newGame<ICreateParams>({
      title: `ParallelApplication:${new Date().toUTCString()}`,
      desc: "",
      params: {
        groupSize: 20
      }
    });
    return { playUrls: keys.map(key => gameId2PlayUrl(gameId, key)) };
  }
);
