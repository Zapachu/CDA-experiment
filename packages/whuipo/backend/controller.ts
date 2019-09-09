import Socket from 'socket.io';
import {NextFunction, Request, Response} from 'express';
import socketEmitter from 'socket.io-emitter';
import path from 'path';
import request from 'request-promise-native';
import {RedisTools} from './redis';
import {Log} from '@elf/util';
import {User} from './models';
import {elfSetting} from '@elf/setting';
import {Config} from './config';
import {iLabX, NSocketParam, Phase, ResCode, SocketEvent, UserGameStatus} from '@micro-experiment/share';
import {RedisCall, Trial} from '@elf/protocol';
import setting from './setting'
import XJWT from './XJWT';

const ioEmitter = socketEmitter({
  host: elfSetting.redisHost,
  port: elfSetting.redisPort
});

function catchError(target: any, key: string, descriptor: PropertyDescriptor) {
  const func = descriptor.value;
  descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction
  ) {
    try {
      await func(req, res, next);
    } catch (e) {
      console.error(e);
      res.json({
        code: ResCode.unexpectError,
        msg: e.message
      });
    }
  };
}

const userSocketMap: { [userId: string]: string[] } = {};
const pushUserSocket = (uid, socketId) => {
  const arr = userSocketMap[uid] || [];
  arr.push(socketId);
  userSocketMap[uid] = arr;
};
const removeUserSocket = (uid, socketId) => {
  const arr = userSocketMap[uid] || [];
  const index = arr.findIndex(i => i === socketId);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
};

const matchRoomOfGame: { [gamePhase: number]: string[] } = {};
const matchRoomTimerOfGame = {};

function initRoom(gamePhase: Phase, params) {
  const arr = [];
  matchRoomOfGame[gamePhase] = arr;
  let i = 0;
  const timerId = setInterval(async () => {
    console.log(`${gamePhase} 房间 正在匹配中, 已等待${i}s`);
    if (i >= Config.matchSeconds) {
      clearRoom(gamePhase);
      await emitMatchSuccess(gamePhase, arr, params);
      return;
    }
    i++;
  }, 1000);
  matchRoomTimerOfGame[gamePhase] = timerId;
  return arr;
}

function joinMatchRoom(gamePhase: Phase, uid, params) {
  let matchRoom = matchRoomOfGame[gamePhase];
  if (!matchRoom || matchRoom.length === 0) {
    matchRoom = initRoom(gamePhase, params);
  }
  matchRoom.push(uid);
}

function leaveRoom(gamePhase: Phase, uid) {
  console.log(gamePhase, 'leave room');
  const matchRoom = matchRoomOfGame[gamePhase] || [];
  const findIndex = matchRoom.findIndex(i => i === uid);
  let flag = false;
  if (findIndex > -1) {
    matchRoom.splice(findIndex, 1);
    flag = true;
  }
  if (matchRoom.length === 0) {
    clearRoom(gamePhase);
  }
  return flag;
}

function clearRoom(gamePhase: Phase) {
  const timerId = matchRoomTimerOfGame[gamePhase];
  if (timerId) {
    clearInterval(timerId);
    matchRoomTimerOfGame[gamePhase] = null;
  }
  matchRoomOfGame[gamePhase] = [];
}

async function emitMatchSuccess(phase: Phase, uids = [], params = {}) {
  const {playUrl} = await RedisCall.call<Trial.Create.IReq,
      Trial.Create.IRes>(Trial.Create.name(phase), params);
  for (const uid of uids) {
    const arr = userSocketMap[uid] || [];
    const playerUrl = playUrl;
    arr.forEach(socketId => {
      ioEmitter
          .to(socketId)
          .emit(SocketEvent.startGame, {playerUrl});
    });
    await RedisTools.setUserGameData(uid, phase, {
      status: UserGameStatus.started,
      playerUrl
    });
    await RedisTools.recordPlayerUrl(playerUrl, uid);
  }
}

export default class RouterController {
  @catchError
  static async loggedIn(req: Request, res: Response, next: NextFunction) {
    const {query: {token}} = req;
    if (req.isAuthenticated()) {
      return next();
    }
    const {isValid, payload} = XJWT.decode(token);
    if (!isValid) {
      return res.redirect(`${Config.rootName}/login`);
    }
    await RouterController.loginILabXUser(req, payload.un);
    next();
  }

  @catchError
  static async renderIndex(req: Request, res: Response) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
  }

  @catchError
  static async renderLogin(req: Request, res: Response) {
    if (req.isAuthenticated() && req.user.iLabXUserName) {
      res.redirect(`${Config.rootName}/`);
    } else {
      res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    }
  }

  @catchError
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
    await RouterController.loginILabXUser(req, response.username);
    res.json({
      code: ResCode.success
    });
  }

  @catchError
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

  static async loginILabXUser(req: Request, iLabXUserName: string) {
    if (req.isAuthenticated()) {
      await User.findByIdAndUpdate(req.user.id, {iLabXUserName});
    } else {
      let user = await User.findOne({iLabXUserName});
      if (!user) {
        user = new User({
          mobile: `null_${iLabXUserName}`,
          iLabXUserName
        });
        await user.save();
      }
      await cbToPromise(req.logIn.bind(req))(user);
    }
  }

  @catchError
  static async getInitInfo(req: Request, res: Response, next: NextFunction) {
    const count = (await RedisTools.getOnlineSessionKeys()).length
    res.json({
      code: ResCode.success,
      user: req.user,
      count,
      waiting:count<100?0:~~(Math.random()*5)
    });
  }
}

export function handleSocketInit(ioServer: Socket.Server) {
  ioServer.on('connection', function (socket) {
    const user = socket.request.user;
    if (socket.request.user.logged_in) {
      pushUserSocket(user._id, socket.id);
    }
    socket.on(SocketEvent.reqStartGame, async function ({multiPlayer, phase, params}: NSocketParam.StartGame) {
      try {
        if (!socket.request.user.logged_in) {
          throw new Error('没有登陆');
        }
        console.log(
            socket.request.isAuthenticated,
            socket.request.isAuthenticated()
        );
        console.log(`请求者uid:${socket.request.user._id}`);
        const uid = socket.request.user._id;
        const userGameData = await RedisTools.getUserGameData(uid, phase);
        if (userGameData && userGameData.status === UserGameStatus.started) {
          socket.emit(SocketEvent.continueGame, {
            playerUrl: userGameData.playerUrl
          });
          return;
        }
        if (
            !userGameData ||
            userGameData.status === UserGameStatus.notStarted
        ) {
          const user = await User.findById(uid);
          if (multiPlayer) {
            joinMatchRoom(phase, user._id, params);
            const matchRoom = matchRoomOfGame[phase];

            await RedisTools.setUserGameData(uid, phase, {
              status: UserGameStatus.matching
            });
            socket.emit(SocketEvent.startMatch);
            if (matchRoom.length === Config.roomSize) {
              await emitMatchSuccess(phase, matchRoom, params);
              await clearRoom(phase);
            }
          } else {
            await emitMatchSuccess(phase, [user._id], params);
          }
        }
      } catch (e) {
        console.error(e);
        handleSocketError(
            SocketEvent.reqStartGame,
            '加入游戏失败!'
        );
      }
    });
    socket.on(SocketEvent.leaveMatchRoom, async function (
        gamePhase
    ) {
      console.log(' req leave room');
      try {
        if (socket.request.user.logged_in) {
          const uid = socket.request.user._id;
          const userGameData = await RedisTools.getUserGameData(uid, gamePhase);
          if (!userGameData) {
            return;
          }
          if (userGameData.status === UserGameStatus.matching) {
            leaveRoom(gamePhase, uid);
            userGameData.status = UserGameStatus.notStarted;
            await RedisTools.setUserGameData(uid, gamePhase, userGameData);
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
          const uid = socket.request.user._id;
          const userSockets = removeUserSocket(uid, socket.id);

          if (userSockets.length === 0) {
            const games = [
              Phase.IPO,
              Phase.OpenAuction,
              Phase.TBM,
              Phase.CBM
            ];
            const tasks = games.map(async (game: Phase) => {
              const userGameData = await RedisTools.getUserGameData(uid, game);
              if (!userGameData) {
                return;
              }
              if (userGameData.status === UserGameStatus.matching) {
                leaveRoom(game, uid);
                userGameData.status = UserGameStatus.notStarted;
                await RedisTools.setUserGameData(uid, game, userGameData);
              }
            });
            await Promise.all(tasks);
          }
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

function cbToPromise(func) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      func(...args, (err, value) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(value);
      });
    });
  };
}
