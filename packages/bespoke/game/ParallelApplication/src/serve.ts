import { resolve } from "path";
import { Server, RedisCall, gameId2PlayUrl } from "bespoke-server";
import Controller from "./Controller";
import Robot from "./Robot";
import { namespace, ICreateParams } from "./config";
import { CreateGame, Phase } from "bespoke-game-stock-trading-config";

Server.start(
  {
    namespace,
    staticPath: resolve(__dirname, "../dist")
  },
  { Controller, Robot }
);

RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(
  "ParallelApplication",
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
