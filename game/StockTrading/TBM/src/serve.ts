import { resolve } from "path";
import { Server, RedisCall, gameId2PlayUrl } from '@bespoke/server';
import { RobotServer} from '@bespoke/robot'
import Controller from "./Controller";
import Robot from "./Robot";
import { namespace, ICreateParams } from "./config";
import {Phase, phaseToNamespace} from "@bespoke-game/stock-trading-config";
import {Trial} from '@elf/protocol'

Server.start(namespace, Controller, resolve(__dirname, '../static'))

RobotServer.start(namespace, Robot)

RedisCall.handle<Trial.Create.IReq, Trial.Create.IRes>(
  Trial.Create.name(phaseToNamespace(Phase.TBM)),
  async () => {
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
    return { playUrl: gameId2PlayUrl(gameId) };
  }
);
