import {resolve} from 'path'
import {gameId2PlayUrl, RedisCall, Server} from 'bespoke-server'
import Controller from './Controller'
import Robot from './Robot'
import {ICreateParams, namespace} from './config'
import {CreateGame, Phase} from 'bespoke-game-stock-trading-config'

Server.start(
  {
    namespace,
    staticPath: resolve(__dirname, "../dist")
  },
  { Controller, Robot }
);

RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(
  CreateGame.name(Phase.ParallelApplication),
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
