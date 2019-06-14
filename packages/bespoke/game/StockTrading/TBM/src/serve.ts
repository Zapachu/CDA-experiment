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
  CreateGame.name(Phase.TBM),
  async ({ keys }) => {
    const gameId = await Server.newGame<ICreateParams>({
      title: `${Phase.TBM}:${new Date().toUTCString()}`,
      desc: "",
      params: {
        groupSize: 12,
        buyerCapitalMin: 50000,
        buyerCapitalMax: 100000,
        buyerPrivateMin: 65,
        buyerPrivateMax: 80,
        sellerQuotaMin: 1000,
        sellerQuotaMax: 2000,
        sellerPrivateMin: 30,
        sellerPrivateMax: 45
      }
    });
    return { playUrls: keys.map(key => gameId2PlayUrl(gameId, key)) };
  }
);
