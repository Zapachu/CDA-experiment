import * as Express from "express";
import { Response, Router } from "express";
import { resolve } from "path";
import * as fs from "fs";
import {
  gameId2PlayUrl,
  RedisCall,
  Server,
  Model,
  BaseLogic
} from "@bespoke/server";
import Controller from "./Controller";
import Robot from "./Robot";
import { ICreateParams, namespace } from "./config";
import { Trial } from "@elf/protocol";
import { elfSetting } from "@elf/setting";
import { RobotServer } from "@bespoke/robot";
// import { config } from "@bespoke/share";

const { FreeStyleModel } = Model;
const ROOTNAME = "gametrial";

// const resultHtmlStr = fs
//   .readFileSync(resolve(__dirname, "../asset/result.html"))
//   .toString();

// const router = Router()
//   .use(
//     "/result/static",
//     Express.static(resolve(__dirname, "../asset"), { maxAge: "10d" })
//   )
//   .get("/result/:gameId", async (req, res: Response) => {
//     const {
//       user,
//       params: { gameId },
//       query: { userId }
//     } = req;
//     if (userId || user) {
//       const key = userId ? userId : user._id.toString();
//       const result = await FreeStyleModel.findOne({
//         game: gameId,
//         key
//       })
//         .lean()
//         .exec();
//       if (result) {
//         const admission = result.data.admission;
//         const scriptStr = `<script type="text/javascript">window._admission=${admission};window._userId="${key}"</script>`;
//         res.set("content-type", "text/html");
//         return res.end(scriptStr + resultHtmlStr);
//       }
//     }
//     return res.redirect(
//       `${elfSetting.proxyOrigin}/${ROOTNAME}/game/${namespace}`
//     );
//   })
//   .get("/getUserId/:gameId", async (req, res: Response) => {
//     const {
//       user: { _id: userId },
//       params: { gameId },
//       query: { token, actorType }
//     } = req;
//     const { game, stateManager } = await BaseLogic.getLogic(gameId);
//     if (game.owner.toString() !== userId.toString()) {
//       const playerState = await stateManager.getPlayerState({
//         type: actorType,
//         token
//       });
//       playerState.userId = userId;
//     }
//     return res.end();
//   })
//   .get("/onceMore/:gameId", async (req, res: Response) => {
//     const result = await RedisCall.call<Trial.Done.IReq, Trial.Done.IRes>(
//       Trial.Done.name,
//       {
//         userId: req.session.user.id,
//         onceMore: true,
//         namespace
//       }
//     );
//     if (result) {
//       return res.json({ code: 0, url: result.lobbyUrl });
//     }
//     return res.json({ code: 1, msg: "server error" });
//   });

Server.start(namespace, Controller, resolve(__dirname, "../static"));

RobotServer.start(namespace, Robot);

RedisCall.handle<Trial.Create.IReq, Trial.Create.IRes>(
  Trial.Create.name(namespace),
  async () => {
    const gameId = await Server.newGame<ICreateParams>({
      title: `${namespace}:${new Date().toUTCString()}`,
      params: {
        groupSize: 10
      }
    });
    return { playUrl: gameId2PlayUrl(gameId) };
  }
);
