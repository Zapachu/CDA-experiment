import { resolve } from "path";
import { Server, RedisCall, gameId2PlayUrl } from '@bespoke/server';
import { RobotServer} from '@bespoke/robot'
import Controller from "./Controller";
import Robot from "./Robot";
import { namespace, ICreateParams } from "./config";
import {Phase, phaseToNamespace} from "@bespoke-game/stock-trading-config";
import {CreateGame} from '@elf/protocol'

Server.start(namespace, Controller,resolve(__dirname, "../dist"));

RobotServer.start(namespace, Robot)

RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(
  CreateGame.name(phaseToNamespace(Phase.TBM)),
  async ({ keys }) => {
    const gameId = await Server.newGame<ICreateParams>({
      title: `${Phase.TBM}:${new Date().toUTCString()}`,
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
