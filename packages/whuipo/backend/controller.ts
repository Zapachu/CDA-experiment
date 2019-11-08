import Socket from 'socket.io';
import {NextFunction, Request, Response} from 'express';
import path from 'path';
import request from 'request-promise-native';
import {redisClient, RedisTools} from './redis';
import {Log} from '@elf/util';
import {User, UserDoc} from './models';
import {Config} from './config';
import {iLabX, NSocketParam, Phase, ResCode, SocketEvent, UserGameStatus} from '@micro-experiment/share';
import {RedisCall, Trial} from '@elf/protocol';
import setting from './setting';
import XJWT from './XJWT';
import {cbToPromise} from './util';

class MatchRoom {
  static matchRoomOfGame: { [gamePhase: number]: string[] } = {};
  static matchRoomTimerOfGame = {};

  static leaveRoom(gamePhase: Phase, uid) {
    console.log(gamePhase, 'leave room');
    const matchRoom = MatchRoom.matchRoomOfGame[gamePhase] || [];
    const findIndex = matchRoom.findIndex(i => i === uid);
    let flag = false;
    if (findIndex > -1) {
      matchRoom.splice(findIndex, 1);
      flag = true;
    }
    if (matchRoom.length === 0) {
      MatchRoom.clearRoom(gamePhase);
    }
    return flag;
  }

  static clearRoom(gamePhase: Phase) {
    const timerId = MatchRoom.matchRoomTimerOfGame[gamePhase];
    if (timerId) {
      clearInterval(timerId);
      MatchRoom.matchRoomTimerOfGame[gamePhase] = null;
    }
    MatchRoom.matchRoomOfGame[gamePhase] = [];
  }
}

export class RequestHandler {

  static async loggedIn(req: Request, res: Response, next: NextFunction) {
    const {query: {token}} = req;
    if (req.isAuthenticated()) {
      return next();
    }
    const {isValid, payload} = XJWT.decode(token);
    if (!isValid) {
      return res.redirect(`${Config.rootName}/login`);
    }
    await RequestHandler.loginILabXUser(req, payload.un, payload.dis);
    next();
  }

  static async renderIndex(req: Request, res: Response) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
  }

  static async renderLogin(req: Request, res: Response) {
    if (req.isAuthenticated() && (req.user as UserDoc).iLabXUserName) {
      res.redirect(`${Config.rootName}/`);
    } else {
      res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    }
  }

  static async login(req: Request, res: Response) {
    const {username, password} = req.body,
        encrypted = XJWT.encryptPassword(password),
        url = `${setting.iLabXGateWay}/sys/api/user/validate?username=${encodeURIComponent(username)}&password=${encodeURIComponent(encrypted.password)}&nonce=${encrypted.nonce}&cnonce=${encrypted.cnonce}`;
    const response = JSON.parse(await request(url));
    Log.d(response);
    if (response.code !== iLabX.ResCode.success) {
      return res.json({
        code: ResCode.unexpectError,
        msg: response.code
      });
    }
    await RequestHandler.loginILabXUser(req, response.username, response.name);
    res.json({
      code: ResCode.success
    });
  }

  static async asGuest(req: Request, res: Response) {
    if (!req.isAuthenticated()) {
      Log.d('Create Guest');
      const username = XJWT.randomStr(8);
      const user = new User({
        mobile: `null_${username}`
      });
      await user.save();
      await cbToPromise(req.logIn.bind(req))(user);
    }
    res.json({
      code: ResCode.success
    });
  }

  static async loginILabXUser(req: Request, iLabXUserName: string, iLabXUserDis: string) {
    if (req.isAuthenticated()) {
      await User.findByIdAndUpdate((req.user as UserDoc).id, {iLabXUserName});
    } else {
      let user = await User.findOne({iLabXUserName});
      if (!user) {
        user = new User({
          mobile: `null_${iLabXUserName}`,
          iLabXUserName,
          iLabXUserDis
        });
        await user.save();
      }
      await cbToPromise(req.logIn.bind(req))(user);
    }
  }

  static async getInitInfo(req: Request, res: Response, next: NextFunction) {
    const count = SocketHandler.connectionMap.size + 80 + ~~(Math.random() * 10),
        waiting = Math.max(count - Object.keys(Phase).length * Config.phaseServerCapacity, 0);
    res.json({
      code: ResCode.success,
      user: req.user,
      count,
      waiting
    });
  }
}

export class SocketHandler {
  static socketServer: Socket.Server;
  static connectionMap: Map<string, string> = new Map();

  static init(server: Socket.Server) {
    this.socketServer = server;
    server.on('connection', function (socket: Socket.Socket) {
      SocketHandler.connectionMap.set(socket.request.user.id, socket.id);
      socket.on(SocketEvent.reqStartGame, async function (startParams: NSocketParam.StartGame) {
        Log.d(startParams);

        function startError(e) {
          Log.e(e);
          handleSocketError(SocketEvent.reqStartGame, '加入游戏失败!');
        }

        const {multiPlayer, phase, force, params} = startParams;
        if (!socket.request.user.logged_in) {
          return startError('未登录');
        }
        const uid = socket.request.user.id;
        const userGameData = await RedisTools.getUserGameData(uid, phase);
        if (userGameData && userGameData.status === UserGameStatus.started && !force) {
          socket.emit(SocketEvent.continueGame, {
            startParams,
            playerUrl: userGameData.playerUrl
          });
          return;
        }
        if (userGameData && userGameData.status === UserGameStatus.matching) {
          return startError('匹配中...');
        }
        if (+(await redisClient.get(RedisTools.phaseServerUsageKey(phase))) >= Config.phaseServerCapacity) {
          return handleSocketError(SocketEvent.reqStartGame, '排队中...');
        }
        const user = await User.findById(uid);
        if (multiPlayer) {
          SocketHandler.joinMatchRoom(phase, user.id, params);
          const matchRoom = MatchRoom.matchRoomOfGame[phase];

          await RedisTools.setUserGameData(uid, phase, {
            status: UserGameStatus.matching
          });
          socket.emit(SocketEvent.startMatch);
          if (matchRoom.length === Config.roomSize) {
            await SocketHandler.emitMatchSuccess(phase, matchRoom, params);
            await MatchRoom.clearRoom(phase);
          }
        } else {
          await SocketHandler.emitMatchSuccess(phase, [user.id], params);
        }
      });
      socket.on(SocketEvent.leaveMatchRoom, async function (phase: Phase) {
        console.log(' req leave room');
        try {
          if (socket.request.user.logged_in) {
            const uid = socket.request.user.id;
            const userGameData = await RedisTools.getUserGameData(uid, phase);
            if (!userGameData) {
              return;
            }
            if (userGameData.status === UserGameStatus.matching) {
              MatchRoom.leaveRoom(phase, uid);
              userGameData.status = UserGameStatus.notStarted;
              await RedisTools.setUserGameData(uid, phase, userGameData);
            }
          }
        } catch (e) {
          console.error(e);
          handleSocketError(
              SocketEvent.leaveMatchRoom,
              '取消匹配失败!'
          );
        }
      });
      socket.on('disconnect', async function () {
        console.log('dis connect');
        try {
          if (socket.request.user.logged_in) {
            const uid = socket.request.user.id;
            const games = [
              Phase.IPO_Median,
              Phase.IPO_TopK,
              Phase.IPO_FPSBA,
              Phase.OpenAuction,
              Phase.TBM,
              Phase.CBM,
              Phase.CBM_L,
            ];
            const tasks = games.map(async (game: Phase) => {
              const userGameData = await RedisTools.getUserGameData(uid, game);
              if (!userGameData) {
                return;
              }
              if (userGameData.status === UserGameStatus.matching) {
                MatchRoom.leaveRoom(game, uid);
                userGameData.status = UserGameStatus.notStarted;
                await RedisTools.setUserGameData(uid, game, userGameData);
              }
            });
            await Promise.all(tasks);
          }
        } catch (e) {
          console.error(e);
        }
      });

      function handleSocketError(event: SocketEvent, msg: string) {
        socket.emit(SocketEvent.handleError, {
          eventType: event,
          msg
        });
      }
    });
  }

  static async emitMatchSuccess(phase: Phase, uids = [], params = {}) {
    const {playUrl} = await RedisCall.call<Trial.Create.IReq,
        Trial.Create.IRes>(Trial.Create.name(phase), params);
    const playerUrl = playUrl;
    await RedisTools.incrByPhaseServerUsage(phase, uids.length);
    for (const uid of uids) {
      this.socketServer.to(SocketHandler.connectionMap.get(uid)).emit(SocketEvent.startGame, {playerUrl});
      await RedisTools.setUserGameData(uid, phase, {
        status: UserGameStatus.started,
        playerUrl
      });
      await RedisTools.recordPlayerUrl(playerUrl, uid);
    }
  }

  static joinMatchRoom(gamePhase: Phase, uid, params) {
    let matchRoom = MatchRoom.matchRoomOfGame[gamePhase];
    if (!matchRoom || matchRoom.length === 0) {
      matchRoom = this.initRoom(gamePhase, params);
    }
    matchRoom.push(uid);
  }

  static initRoom(gamePhase: Phase, params) {
    const arr = [];
    MatchRoom.matchRoomOfGame[gamePhase] = arr;
    let i = 0;
    MatchRoom.matchRoomTimerOfGame[gamePhase] = setInterval(async () => {
      console.log(`${gamePhase} 房间 正在匹配中, 已等待${i}s`);
      if (i >= Config.matchSeconds) {
        MatchRoom.clearRoom(gamePhase);
        await this.emitMatchSuccess(gamePhase, arr, params);
        return;
      }
      i++;
    }, 1000);
    return arr;
  }
}
