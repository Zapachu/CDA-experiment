import Socket from 'socket.io'
import passport from 'passport'
import { Request, Response, NextFunction } from 'express'
import socketEmitter from 'socket.io-emitter'
import {RedisCall} from 'bespoke-server'
import path from 'path'
import Redis from 'ioredis'
import {URL} from 'url'
import qs from 'qs'

import { User } from './models'
import { UserDoc } from './interfaces'
import settings from './settings'
import {Phase, CreateGame, PhaseDone} from 'bespoke-game-stock-trading-config'
import { ResCode, serverSocketListenEvents, clientSocketListenEvnets, UserGameStatus } from './enums'

const ioEmitter = socketEmitter({ host: settings.redishost, port: settings.redisport })
const redisCli = new Redis(settings.redisport, settings.redishost)

passport.serializeUser(function (user: UserDoc, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

function catchError(target: any, key: string, descriptor: PropertyDescriptor) {
    const func = descriptor.value
    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
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

const userSocketMap: { [userId: string]: string[] } = {
}
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

const matchRoomLimit = settings.gameRoomSize || 10
const waittingTime = settings.gameMatchTime || 10 // 秒
const matchRoomOfGame: {[gamePhase: number]: string[]} = {
}
const matchRoomTimerOfGame = {}


const initRoom = (gamePhase: Phase) => {
    const arr = []
    matchRoomOfGame[gamePhase] = arr
    let i = 0
    const timerId = setInterval(async () => {
        console.log(`${gamePhase} 房间 正在匹配中, 已等待${i}s`)
        if (i === waittingTime) {
            clearRoom(gamePhase)
            await emitMatchSuccess(gamePhase, arr)
            return
        }
        i++
    }, 1000)
    matchRoomTimerOfGame[gamePhase] = timerId
    return arr
}

const joinMatchRoom = (gamePhase: Phase, uid) => {
    let matchRoom = matchRoomOfGame[gamePhase]
    if (!matchRoom || matchRoom.length === 0) {
        matchRoom = initRoom(gamePhase)
    }
    matchRoom.push(uid)
}
const leaveRoom = (gamePhase: Phase, uid) => {
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

const clearRoom = (gamePhase: Phase) => {
    const timerId = matchRoomTimerOfGame[gamePhase]
    if (timerId) {
        clearInterval(timerId)
        matchRoomTimerOfGame[gamePhase] = null
    }
    matchRoomOfGame[gamePhase] = []
}

const emitMatchSuccess = async (gamePhase: Phase, uids = []) => {
    const {playUrls: playerUrls} = await RedisCall.call<CreateGame.IReq, CreateGame.IRes>(CreateGame.name(gamePhase), {
        keys: uids
    })
    console.log(playerUrls, 'urls')
    uids.forEach(async (uid, index) => {
        const arr = userSocketMap[uid] || []
        const playerUrl = playerUrls[index]
        arr.forEach(socketId => {
            ioEmitter.to(socketId).emit(clientSocketListenEvnets.startGame, {playerUrl })
        })
        await RedisTools.setUserGameData(uid, gamePhase, {
            status: UserGameStatus.started,
            playerUrl
        })
        await RedisTools.recordPalyerUrl(playerUrl, uid)
    })
}

interface UserGameData {
    playerUrl?: string,
    status: UserGameStatus
}

const RedisTools = {
    _getUserGameKey: (uid: string, game: Phase) => `usergamedata:${uid}/${game}`,
    _getRecordPlayerUrlKey: (playerUrl: string) => `playerUrlToUid:${playerUrl}`,
    setUserGameData: async (uid: string, game: Phase, data: {playerUrl?: string, status?: UserGameStatus}) => {
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
    recordPalyerUrl: async (playerUrl: string, uid: string) => {
        await redisCli.set(RedisTools._getRecordPlayerUrlKey(playerUrl), uid)
    },
    getPlayerUrlRecord: async (playerUrl: string) => {
        return await redisCli.get(RedisTools._getRecordPlayerUrlKey(playerUrl))
    }
}

const gamePhaseOrder = {
    [Phase.IPO_Median]: 1,
    [Phase.IPO_TopK]: 1,
    [Phase.TBM]: 2,
    [Phase.CBM]: 3,
    [Phase.CBM_Leverage]: 3
}

RedisCall.handle<PhaseDone.IReq, PhaseDone.IRes>(PhaseDone.name, async ({playUrl, onceMore, phase}) => {
    console.log(`redis handle phase: ${phase} done`, playUrl, onceMore)
    const uid = await RedisTools.getPlayerUrlRecord(playUrl)
    const user = await User.findById(uid)
    let lobbyUrl = settings.lobbyUrl
    if (user) {
        const lastUserUnlockOrder = gamePhaseOrder[user.unblockGamePhase] || -1
        const orderOfNowGame = gamePhaseOrder[phase]
        if (orderOfNowGame > lastUserUnlockOrder) {
            user.unblockGamePhase = phase
        }
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
})
export default class RouterController {
    @catchError
    static async isLogined(req: Request, res: Response, next: NextFunction) {
        if (!req.isAuthenticated()) {
            console.log('未登录 sessionId: ', req.sessionID)
            if (!['get', 'post'].includes(req.method.toLowerCase())) {
                throw new Error('非法请求')
            }
            const key = req.sessionID
            let user = await User.findOne({ unionId: key })
            if (!user) {
                user = new User({
                    unionId: key,
                })
                await user.save()
            }

            await cbToPromise(req.logIn.bind(req))(user)
        }
        next()
    }

    @catchError
    static async renderIndex(req: Request, res: Response, next: NextFunction) {
        res.sendFile(process.env.NODE_ENV === 'production' ? path.resolve(__dirname, '../dist/index.html') : path.resolve(__dirname, './dist/index.html'))
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
        console.log('connected')
        const user = socket.request.user
        if (socket.request.user.logged_in) {
            pushUserSocket(user._id, socket.id)
        }
        socket.on(serverSocketListenEvents.reqStartGame, async function (msg: {isGroupMode: boolean, gamePhase: Phase}) {
            try {
                console.log('req Start msg: ');
                console.log(msg)
                if (!socket.request.user.logged_in) {
                    throw new Error('没有登陆')
                }
                console.log(socket.request.isAuthenticated, socket.request.isAuthenticated())
                console.log(`请求者uid:${socket.request.user._id}`)
                const uid = socket.request.user._id
                const {isGroupMode, gamePhase} = msg
                const userGameData = await RedisTools.getUserGameData(uid, gamePhase)
                if (userGameData && userGameData.status === UserGameStatus.started) {
                    socket.emit(clientSocketListenEvnets.continueGame, {
                        playerUrl: userGameData.playerUrl
                    })
                    return
                }
                if (!userGameData || userGameData.status === UserGameStatus.notStarted) {
                    const user = await User.findById(uid)
                    const orderOfPhase = gamePhaseOrder[gamePhase]
                    const unblockPhaseLimit = gamePhaseOrder[user.unblockGamePhase]
                    if (orderOfPhase > unblockPhaseLimit + 1) {
                        throw new Error('该游戏尚未解锁')
                    }
                    if (isGroupMode) {
                        joinMatchRoom(gamePhase, user._id)
                        const matchRoom = matchRoomOfGame[gamePhase]
                        
                        await RedisTools.setUserGameData(uid, gamePhase,
                            {
                                status: UserGameStatus.waittingMatch
                            }
                        )
                        socket.emit(clientSocketListenEvnets.startMatch) // TODO
                        if (matchRoom.length === matchRoomLimit) {
                            await emitMatchSuccess(gamePhase, matchRoom)
                            await clearRoom(gamePhase)
                        }
                    } else {
                        await emitMatchSuccess(gamePhase, [user._id])
                    }
                }
            } catch (e) {
                console.error(e)
                handleSocketError(serverSocketListenEvents.reqStartGame, '加入游戏失败!')
            }

        });
        socket.on(serverSocketListenEvents.leaveMatchRoom, async function (gamePhase) {
            console.log(' req leave room')
            try {
                if (socket.request.user.logged_in) {
                    const uid = socket.request.user._id
                    const userGameData = await RedisTools.getUserGameData(uid, gamePhase)
                    if (!userGameData) {
                        return
                    }
                    if (userGameData.status === UserGameStatus.waittingMatch) {
                        leaveRoom(gamePhase, uid)
                        userGameData.status = UserGameStatus.notStarted
                        await RedisTools.setUserGameData(uid, gamePhase, userGameData)
                    }
                }
            } catch (e) {
                console.error(e)
                handleSocketError(serverSocketListenEvents.leaveMatchRoom, '取消匹配失败!')
            }
           
        })
        socket.on('disconnect',async function () {
            console.log('dis connect')
            try {
                if (socket.request.user.logged_in) {
                    const uid = socket.request.user._id
                    const userSockets = removeUserSocket(uid, socket.id)                
                    
                    if (userSockets.length === 0) {
                        const games = [Phase.CBM, Phase.CBM_Leverage, Phase.CBM_Leverage, Phase.IPO_Median, Phase.IPO_TopK, Phase.TBM, ]
                        const tasks = games.map(async (game: Phase) => {
                            const userGameData = await RedisTools.getUserGameData(uid, game)
                            if (!userGameData) {
                                return
                            }
                            if (userGameData.status === UserGameStatus.waittingMatch) {
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

        function handleSocketError (event: serverSocketListenEvents, msg: string) {
            socket.emit(clientSocketListenEvnets.handleError, {
                eventType: event,
                msg
            })
        }
    });
 
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

