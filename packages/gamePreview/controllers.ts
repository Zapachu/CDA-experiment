import Socket from 'socket.io'
import passport from 'passport'
import { Request, Response, NextFunction } from 'express'
import socketEmitter from 'socket.io-emitter'
import {RedisCall} from 'bespoke-server'
import Redis from 'ioredis'
import {URL} from 'url'
import qs from 'qs'

import { User } from './models'
import { UserDoc } from './interface'
import settings from './settings'
import {Phase, CreateGame, PhaseDone} from 'bespoke-game-stock-trading-config'
import { ResCode, serverSocketListenEvents, clientSocketListenEvnets, UserGameStatus } from './enums'
import areaCode from './config/areaCode'
import gameConfig from './config/gameConfig'

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

interface UserGameData {
    playerUrl?: string,
    status: UserGameStatus
}

class RedisTools {
    redisCli: Redis.Redis
    constructor (redisCli: Redis.Redis) {
        this.redisCli = redisCli
    }
    _getUserGameKey = (uid: string, game: Phase) => `usergamedata:${uid}/${game}`
    _getRecordPlayerUrlKey = (playerUrl: string) => `playerUrlToUid:${playerUrl}`
    _getGamePlayerCountKey = (game: Phase) => `gamePlayerCount:${game}`
    async setUserGameData (uid: string, game: Phase, data: {playerUrl?: string, status?: UserGameStatus}) {
        const key = this._getUserGameKey(uid, game)
        const oldData = await this.redisCli.get(key)
        const oldDataObj = oldData ? JSON.parse(oldData) : {}
        const mergeData = Object.assign(oldDataObj, data)
        await this.redisCli.set(key, JSON.stringify(mergeData), 'EX', settings.recordExpire || 3600)
    }
    async getUserGameData (uid: string, game: Phase): Promise<UserGameData> {
        const key = this._getUserGameKey(uid, game)
        console.log('userGameDatakey', key)
        const oldData = await this.redisCli.get(key)
        return oldData ? JSON.parse(oldData) : null
    }
    async recordPalyerUrl (playerUrl: string, uid: string) {
        await this.redisCli.set(this._getRecordPlayerUrlKey(playerUrl), uid, 'EX', settings.recordExpire || 3600)
    }
    async getPlayerUrlRecord (playerUrl: string) {
        return await this.redisCli.get(this._getRecordPlayerUrlKey(playerUrl))
    }
    async getGamePlayerCount (game: Phase) {
        const keys = await this.redisCli.keys(this._getUserGameKey('*', game))
        return keys ? keys.length : 0
    }
}


class RoomManager {
    matchRoomLimit: number
    waittingTime: number
    matchRoomOfGame: {[gamePhase: number]: string[]}
    matchRoomTimerOfGame: object
    sockerManager: SocketManager

    constructor (sockerManager: SocketManager) {
        this.matchRoomLimit = settings.gameRoomSize || 10
        this.waittingTime = settings.gameMatchTime || 10 // 秒
        this.matchRoomOfGame = {
        }
        this.matchRoomTimerOfGame = {} 
        this.sockerManager = sockerManager
    }
    initRoom (gamePhase: Phase) {
        const arr = []
        this.matchRoomOfGame[gamePhase] = arr
        let i = 0
        const timerId = setInterval(async () => {
            console.log(`${gamePhase} 房间 正在匹配中, 已等待${i}s`)
            if (i === this.waittingTime) {
                this.clearRoom(gamePhase)
                await this.sockerManager.emitMatchSuccess(gamePhase, arr)
                return
            }
            i++
        }, 1000)
        this.matchRoomTimerOfGame[gamePhase] = timerId
        return arr
    }
    
    joinMatchRoom (gamePhase: Phase, uid) {
        let matchRoom = this.matchRoomOfGame[gamePhase]
        if (!matchRoom || matchRoom.length === 0) {
            matchRoom = this.initRoom(gamePhase)
        }
        matchRoom.push(uid)
    }
    leaveRoom (gamePhase: Phase, uid) {
        console.log(gamePhase, 'leave room')
        const matchRoom = this.matchRoomOfGame[gamePhase] || []
        const findIndex = matchRoom.findIndex(i => i === uid)
        let flag = false
        if (findIndex > -1) {
            matchRoom.splice(findIndex, 1)
            flag = true
        }
        if (matchRoom.length === 0) {
            this.clearRoom(gamePhase)
        }
        return flag
    }
    
    clearRoom (gamePhase: Phase) {
        const timerId = this.matchRoomTimerOfGame[gamePhase]
        if (timerId) {
            clearInterval(timerId)
            this.matchRoomTimerOfGame[gamePhase] = null
        }
        this.matchRoomOfGame[gamePhase] = []
    }
}

class SocketManager {
    userSocketMap:  { [userId: string]: string[] }
    redisTool: RedisTools
    constructor (redisTool: RedisTools) {
        this.userSocketMap = {}
        this.redisTool = redisTools
    }
    pushUserSocket (uid, socketId) {
        const arr = this.userSocketMap[uid] || []
        arr.push(socketId)
        this.userSocketMap[uid] = arr
    }
    removeUserSocket (uid, socketId) {
        const arr = this.userSocketMap[uid] || []
        const index = arr.findIndex(i => i === socketId)
        if (index > -1) {
            arr.splice(index, 1)
        }
        return arr
    }
    
    async emitMatchSuccess (gamePhase: Phase, uids = []) {
        const {playUrls: playerUrls} = await RedisCall.call<CreateGame.IReq, CreateGame.IRes>(CreateGame.name(gamePhase), {
            keys: uids
        })
        console.log(playerUrls, 'urls')
        uids.forEach(async (uid, index) => {
            const arr = this.userSocketMap[uid] || []
            const playerUrl = playerUrls[index]
            arr.forEach(socketId => {
                ioEmitter.to(socketId).emit(clientSocketListenEvnets.startGame, {playerUrl })
            })
            await this.redisTool.setUserGameData(uid, gamePhase, {
                status: UserGameStatus.started,
                playerUrl
            })
            await this.redisTool.recordPalyerUrl(playerUrl, uid)
        })
    }
}

const redisTools = new RedisTools(redisCli);
const sockerManager = new SocketManager(redisTools);
const roomManager = new RoomManager(sockerManager);

// const gamePhaseOrder = {
//     [Phase.IPO_Median]: 1,
//     [Phase.IPO_TopK]: 1,
//     [Phase.TBM]: 2,
//     [Phase.CBM]: 3,
//     [Phase.CBM_Leverage]: 3
// }

RedisCall.handle<PhaseDone.IReq, PhaseDone.IRes>(PhaseDone.name, async ({playUrl, onceMore, phase}) => {
    console.log(`redis handle phase: ${phase} done`, playUrl, onceMore)
    const uid = await redisTools.getPlayerUrlRecord(playUrl)
    // const user = await User.findById(uid)
    let lobbyUrl = settings.lobbyUrl
    // if (user) {
        // const lastUserUnlockOrder = gamePhaseOrder[user.unblockGamePhase] || -1
        // const orderOfNowGame = gamePhaseOrder[phase]
        // if (orderOfNowGame > lastUserUnlockOrder) {
        //     user.unblockGamePhase = phase
        // }
        // await user.save()
        await redisTools.setUserGameData(uid, phase, {
            status: UserGameStatus.notStarted
        })
        if (onceMore) {
            const urlObj = new URL(lobbyUrl)
            const queryObj = qs.parse(urlObj.search.replace('?', '')) || {}
            queryObj.gamePhase = phase
            urlObj.search = qs.stringify(queryObj)
            lobbyUrl = urlObj.toString()
        }
    // }
    console.log(lobbyUrl, 'lobbyurl')
    return {lobbyUrl}
})

interface IRequest extends Request {
    csrfToken: () => string;
}

  
export default class RouterController {
    // @catchError
    // static async isLogined(req: Request, res: Response, next: NextFunction) {
    //     if (!req.isAuthenticated()) {
    //         console.log('未登录 sessionId: ', req.sessionID)
    //         if (!['get', 'post'].includes(req.method.toLowerCase())) {
    //             throw new Error('非法请求')
    //         }
    //         const key = req.sessionID
    //         let user = await User.findOne({ unionId: key })
    //         if (!user) {
    //             user = new User({
    //                 unionId: key,
    //             })
    //             await user.save()
    //         }

    //         await cbToPromise(req.logIn.bind(req))(user)
    //     }
    //     next()
    // }

    @catchError
    static async renderIndex(req: IRequest, res: Response, next: NextFunction) {
        const tasks = Object.keys(gameConfig).map(async (gameType) => {
            const playerCount = await redisTools.getGamePlayerCount(gameType as any)
            return {
                ...gameConfig[gameType],
                type: gameType,
                desc: '',
                playerCount
            }
        });
        const gameList = await Promise.all(tasks)
        console.log(gameList)
        res.render('views', {
            areaCode,
            gameList,
            isLogin: req.isAuthenticated(),
            rootname: settings.rootname
        })
    }

    @catchError
    static async renderGamePage (req: IRequest, res: Response, next: NextFunction) {
        const gameType = req.params.type
        const game =  gameConfig[gameType]
        game.type = gameType
        res.render('game', {
            areaCode,
            game,
            isLogin: req.isAuthenticated(),
            rootname: settings.rootname
        })
    }

    @catchError
    static async getInitInfo(req: IRequest, res: Response, next: NextFunction) {
        res.json({
            code: ResCode.success,
            user: req.user,
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
            sockerManager.pushUserSocket(user._id, socket.id)
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
                const userGameData = await redisTools.getUserGameData(uid, gamePhase)
                console.log(userGameData, 'gameData', msg)
                if (userGameData && userGameData.status === UserGameStatus.started) {
                    socket.emit(clientSocketListenEvnets.continueGame, {
                        playerUrl: userGameData.playerUrl
                    })
                    return
                }
                if (!userGameData || userGameData.status === UserGameStatus.notStarted) {
                    const user = await User.findById(uid)
                    if (isGroupMode) {
                        roomManager.joinMatchRoom(gamePhase, user._id)
                        const matchRoom = roomManager.matchRoomOfGame[gamePhase]
                        
                        await redisTools.setUserGameData(uid, gamePhase,
                            {
                                status: UserGameStatus.waittingMatch
                            }
                        )
                        socket.emit(clientSocketListenEvnets.startMatch) // TODO
                        if (matchRoom.length === roomManager.matchRoomLimit) {
                            await sockerManager.emitMatchSuccess(gamePhase, matchRoom)
                            await roomManager.clearRoom(gamePhase)
                        }
                    } else {
                        await sockerManager.emitMatchSuccess(gamePhase, [user._id])
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
                    const userGameData = await redisTools.getUserGameData(uid, gamePhase)
                    if (!userGameData) {
                        return
                    }
                    if (userGameData.status === UserGameStatus.waittingMatch) {
                        roomManager.leaveRoom(gamePhase, uid)
                        userGameData.status = UserGameStatus.notStarted
                        await redisTools.setUserGameData(uid, gamePhase, userGameData)
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
                    const userSockets = sockerManager.removeUserSocket(uid, socket.id)                
                    
                    if (userSockets.length === 0) {
                        const games = Object.keys(gameConfig) as Array<any> as Array<Phase>
                        const tasks = games.map(async (game: Phase) => {
                            const userGameData = await redisTools.getUserGameData(uid, game)
                            if (!userGameData) {
                                return
                            }
                            if (userGameData.status === UserGameStatus.waittingMatch) {
                                roomManager.leaveRoom(game, uid)
                                userGameData.status = UserGameStatus.notStarted
                                await redisTools.setUserGameData(uid, game, userGameData)
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


// function cbToPromise(func) {
//     return function (...args) {
//         return new Promise((resolve, reject) => {
//             func(...args, (err, value) => {
//                 if (err) {
//                     reject(err)
//                     return
//                 }
//                 resolve(value)
//             })
//         })
//     }
// }

