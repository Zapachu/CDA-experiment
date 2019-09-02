import Socket from 'socket.io'
import passport from 'passport'
import {NextFunction, Request, Response} from 'express'
import socketEmitter from 'socket.io-emitter'
import path from 'path'
import request from 'request-promise-native'
import Redis from 'ioredis'
import {URL} from 'url'
import qs from 'qs'
import {Log} from '@elf/util'
import {User} from './models'
import {UserDoc} from './interfaces'
import {elfSetting} from '@elf/setting'
import config from './config'
import setting from './setting'
import {iLabX, NSocketParam, Phase, ResCode, SocketEvent, UserGameStatus} from '@micro-experiment/share'
import {RedisCall, Trial} from '@elf/protocol'
import XJWT, {encryptPassword, Type as XJWTType} from './XJWT'

const ioEmitter = socketEmitter({
  host: elfSetting.redisHost,
  port: elfSetting.redisPort
})
const redisCli = new Redis(elfSetting.redisPort, elfSetting.redisHost)

passport.serializeUser(function (user: UserDoc, done) {
  done(null, user._id)
})
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

function catchError(target: any, key: string, descriptor: PropertyDescriptor) {
  const func = descriptor.value
  descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction
  ) {
    try {
      await func(req, res, next)
    } catch (e) {
      console.error(e)
      res.json({
        code: ResCode.unexpectError,
        msg: e.message
      })
    }
  }
}

const userSocketMap: { [userId: string]: string[] } = {}
const pushUserSocket = (uid, socketId) => {
  const arr = userSocketMap[uid] || []
  arr.push(socketId)
  userSocketMap[uid] = arr
}
const removeUserSocket = (uid, socketId) => {
  const arr = userSocketMap[uid] || []
  const index = arr.findIndex(i => i === socketId)
  if (index > -1) {
    arr.splice(index, 1)
  }
  return arr
}

const matchRoomLimit = config.gameRoomSize || 10
const waitSeconds = config.gameMatchTime || 10
const matchRoomOfGame: { [gamePhase: number]: string[] } = {}
const matchRoomTimerOfGame = {}

function initRoom(gamePhase: Phase, params) {
  const arr = []
  matchRoomOfGame[gamePhase] = arr
  let i = 0
  const timerId = setInterval(async () => {
    console.log(`${gamePhase} 房间 正在匹配中, 已等待${i}s`)
    if (i === waitSeconds) {
      clearRoom(gamePhase)
      await emitMatchSuccess(gamePhase, arr, params)
      return
    }
    i++
  }, 1000)
  matchRoomTimerOfGame[gamePhase] = timerId
  return arr
}

function joinMatchRoom(gamePhase: Phase, uid, params) {
  let matchRoom = matchRoomOfGame[gamePhase]
  if (!matchRoom || matchRoom.length === 0) {
    matchRoom = initRoom(gamePhase, params)
  }
  matchRoom.push(uid)
}

function leaveRoom(gamePhase: Phase, uid) {
  console.log(gamePhase, 'leave room')
  const matchRoom = matchRoomOfGame[gamePhase] || []
  const findIndex = matchRoom.findIndex(i => i === uid)
  let flag = false
  if (findIndex > -1) {
    matchRoom.splice(findIndex, 1)
    flag = true
  }
  if (matchRoom.length === 0) {
    clearRoom(gamePhase)
  }
  return flag
}

function clearRoom(gamePhase: Phase) {
  const timerId = matchRoomTimerOfGame[gamePhase]
  if (timerId) {
    clearInterval(timerId)
    matchRoomTimerOfGame[gamePhase] = null
  }
  matchRoomOfGame[gamePhase] = []
}

async function emitMatchSuccess(phase: Phase, uids = [], params = {}) {
  const {playUrl} = await RedisCall.call<Trial.Create.IReq,
      Trial.Create.IRes>(Trial.Create.name(phase), params)
  uids.forEach(async uid => {
    const arr = userSocketMap[uid] || []
    const playerUrl = playUrl
    arr.forEach(socketId => {
      ioEmitter
          .to(socketId)
          .emit(SocketEvent.startGame, {playerUrl})
    })
    await RedisTools.setUserGameData(uid, phase, {
      status: UserGameStatus.started,
      playerUrl
    })
    await RedisTools.recordPlayerUrl(playerUrl, uid)
  })
}

interface UserGameData {
  playerUrl?: string;
  status: UserGameStatus;
}

const RedisTools = {
  _getUserGameKey: (uid: string, game: Phase) => `usergamedata:${uid}/${game}`,
  _getRecordPlayerUrlKey: (playerUrl: string) => `playerUrlToUid:${playerUrl}`,
  setUserGameData: async (
      uid: string,
      game: Phase,
      data: { playerUrl?: string; status?: UserGameStatus }
  ) => {
    const key = RedisTools._getUserGameKey(uid, game)
    const oldData = await redisCli.get(key)
    const oldDataObj = oldData ? JSON.parse(oldData) : {}
    const mergeData = Object.assign(oldDataObj, data)
    await redisCli.set(key, JSON.stringify(mergeData))
  },
  getUserGameData: async (uid: string, game: Phase): Promise<UserGameData> => {
    const key = RedisTools._getUserGameKey(uid, game)
    const oldData = await redisCli.get(key)
    return oldData ? JSON.parse(oldData) : null
  },
  recordPlayerUrl: async (playerUrl: string, uid: string) => {
    await redisCli.set(RedisTools._getRecordPlayerUrlKey(playerUrl), uid)
  }
}

const PhaseScore = {
  [Phase.IPO]: 20,
  [Phase.OpenAuction]: 20,
  [Phase.TBM]: 20,
  [Phase.CBM]: 40,
}

RedisCall.handle<Trial.Done.IReq, Trial.Done.IRes>(
    Trial.Done.name,
    async ({userId, onceMore, namespace}) => {
      const phase = namespace as Phase
      const uid = userId
      const user = await User.findById(uid)
      let lobbyUrl = setting.lobbyUrl
      if (user) {
        sendBackData({timestamp: Date.now()})
        const phaseScore = (user.phaseScore || []).slice()
        phaseScore[phase] = PhaseScore[phase]
        user.phaseScore = phaseScore
        await user.save()
        await RedisTools.setUserGameData(uid, phase, {
          status: UserGameStatus.notStarted
        })
        if (onceMore) {
          const urlObj = new URL(lobbyUrl)
          const queryObj = qs.parse(urlObj.search.replace('?', '')) || {}
          queryObj.gamePhase = phase
          urlObj.search = qs.stringify(queryObj)
          lobbyUrl = urlObj.toString()
        }
      }
      console.log(lobbyUrl, 'lobbyurl')
      return {lobbyUrl}
    }
)
export default class RouterController {
  @catchError
  static async loggedIn(req: Request, res: Response, next: NextFunction) {
    const {query: {token}} = req
    Log.d(req.user)
    if (req.isAuthenticated()) {
      return next()
    }
    const {isValid, payload} = XJWT.decode(token)
    if (!isValid) {
      return res.redirect(`${config.rootname}/login`)
    }
    await RouterController.loginILabXUser(req, payload.un)
    next()
  }

  @catchError
  static async renderIndex(req: Request, res: Response) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'))
  }

  @catchError
  static async renderLogin(req: Request, res: Response) {
    if (req.isAuthenticated()) {
      res.redirect(`${config.rootname}/`)
    } else {
      res.sendFile(path.resolve(__dirname, '../dist/index.html'))
    }
  }

  @catchError
  static async login(req: Request, res: Response, next: NextFunction) {
    const {username, password} = req.body,
        encrypted = encryptPassword(password),
        url = `http://ilab-x.com/sys/api/user/validate?username=${encodeURIComponent(username)}&password=${encodeURIComponent(encrypted.password)}&nonce=${encrypted.nonce}&cnonce=${encrypted.cnonce}`
    const response = JSON.parse(await request(url))
    Log.d(response)
    if (response.code !== iLabX.ResCode.success) {
      return res.json({
        code: ResCode.unexpectError,
        msg: response.code
      })
    }
    await RouterController.loginILabXUser(req, response.username)
    res.json({
      code: ResCode.success
    })
  }

  static async loginILabXUser(req:Request, username:string){
    let user = await User.findOne({iLabXUserName: username})
    if (!user) {
      user = new User({
        mobile: `null_${username}`,
        iLabXUserName: username
      })
      await user.save()
    }
    await cbToPromise(req.logIn.bind(req))(user)
  }

  @catchError
  static async getInitInfo(req: Request, res: Response, next: NextFunction) {
    res.json({
      code: ResCode.success,
      user: req.user
    })
  }
}

export function handleSocketPassportSuccess(data, cb) {
  cb(null, true)
}

export function handleSocketPassportFailed(data, msg, error, cb) {
  console.error('soket passport failed: error:', msg)
  cb(null, true)
}

export function handleSocketInit(ioServer: Socket.Server) {
  ioServer.on('connection', function (socket) {
    const user = socket.request.user
    if (socket.request.user.logged_in) {
      pushUserSocket(user._id, socket.id)
    }
    socket.on(SocketEvent.reqStartGame, async function ({multiPlayer, phase, params}: NSocketParam.StartGame) {
      try {
        if (!socket.request.user.logged_in) {
          throw new Error('没有登陆')
        }
        console.log(
            socket.request.isAuthenticated,
            socket.request.isAuthenticated()
        )
        console.log(`请求者uid:${socket.request.user._id}`)
        const uid = socket.request.user._id
        const userGameData = await RedisTools.getUserGameData(uid, phase)
        if (userGameData && userGameData.status === UserGameStatus.started) {
          socket.emit(SocketEvent.continueGame, {
            playerUrl: userGameData.playerUrl
          })
          return
        }
        if (
            !userGameData ||
            userGameData.status === UserGameStatus.notStarted
        ) {
          const user = await User.findById(uid)
          if (multiPlayer) {
            joinMatchRoom(phase, user._id, params)
            const matchRoom = matchRoomOfGame[phase]

            await RedisTools.setUserGameData(uid, phase, {
              status: UserGameStatus.matching
            })
            socket.emit(SocketEvent.startMatch)
            if (matchRoom.length === matchRoomLimit) {
              await emitMatchSuccess(phase, matchRoom, params)
              await clearRoom(phase)
            }
          } else {
            await emitMatchSuccess(phase, [user._id], params)
          }
        }
      } catch (e) {
        console.error(e)
        handleSocketError(
            SocketEvent.reqStartGame,
            '加入游戏失败!'
        )
      }
    })
    socket.on(SocketEvent.leaveMatchRoom, async function (
        gamePhase
    ) {
      console.log(' req leave room')
      try {
        if (socket.request.user.logged_in) {
          const uid = socket.request.user._id
          const userGameData = await RedisTools.getUserGameData(uid, gamePhase)
          if (!userGameData) {
            return
          }
          if (userGameData.status === UserGameStatus.matching) {
            leaveRoom(gamePhase, uid)
            userGameData.status = UserGameStatus.notStarted
            await RedisTools.setUserGameData(uid, gamePhase, userGameData)
          }
        }
      } catch (e) {
        console.error(e)
        handleSocketError(
            SocketEvent.leaveMatchRoom,
            '取消匹配失败!'
        )
      }
    })
    socket.on('disconnect', async function () {
      console.log('dis connect')
      try {
        if (socket.request.user.logged_in) {
          const uid = socket.request.user._id
          const userSockets = removeUserSocket(uid, socket.id)

          if (userSockets.length === 0) {
            const games = [
              Phase.IPO,
              Phase.OpenAuction,
              Phase.TBM,
              Phase.CBM
            ]
            const tasks = games.map(async (game: Phase) => {
              const userGameData = await RedisTools.getUserGameData(uid, game)
              if (!userGameData) {
                return
              }
              if (userGameData.status === UserGameStatus.matching) {
                leaveRoom(game, uid)
                userGameData.status = UserGameStatus.notStarted
                await RedisTools.setUserGameData(uid, game, userGameData)
              }
            })
            await Promise.all(tasks)
          }
        }
      } catch (e) {
        console.error(e)
      }
    })

    function handleSocketError(event: SocketEvent, msg: string) {
      socket.emit(SocketEvent.handleError, {
        eventType: event,
        msg
      })
    }
  })
}

function cbToPromise(func) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      func(...args, (err, value) => {
        if (err) {
          reject(err)
          return
        }
        resolve(value)
      })
    })
  }
}

async function sendBackData(body) {
  const token = XJWT.encode(XJWTType.SYS)
  const url = `http://ilab-x.com/project/log/upload?xjwt=${encodeURIComponent(
      token
  )}`
  const response = await request({
    url,
    method: 'POST',
    body,
    json: true
  })
  console.log(response)
}
