import Socket from 'socket.io'
import passport from 'passport'
import { Request, Response, NextFunction } from 'express'
import socketEmitter from 'socket.io-emitter'
import {RedisCall} from 'bespoke-server'
import path from 'path'

import { User } from './models'
import { UserDoc } from './interfaces'
import settings from './settings'
import {Phase, CreateGame, PhaseDone} from '../protocol'
import { ResCode, serverSocketListenEvents, clientSocketListenEvnets, UserGameStatus } from './enums'
import XJWT from './XJWT';

const ioEmitter = socketEmitter({ host: settings.redishost, port: settings.redisport })

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

const matchRoomLimit = 10
const waittingTime = 10 // 秒
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
        await User.updateOne({
            _id: uid
        }, {
            $set: {
                status: UserGameStatus.started,
                playerUrl
            }
        })
    })
}

const gamePhaseOrder = {
    [Phase.CBM]: 1,
    [Phase.IPO_Median]: 2,
    [Phase.IPO_TopK]: 2,
    [Phase.TBM]: 3
}

RedisCall.handle<PhaseDone.IReq, PhaseDone.IRes>(PhaseDone.name, async ({playUrl, onceMore}) => {
    console.log('redis handle phase done', playUrl, onceMore)
    const user = await User.findOne({playerUrl: playUrl})
    console.log(!!user)
    if (user) {
        const lastUserUnlockOrder = gamePhaseOrder[user.unblockGamePhase] || -1
        const orderOfNowGame = gamePhaseOrder[user.nowJoinedGame]
        if (orderOfNowGame > lastUserUnlockOrder) {
            user.unblockGamePhase = user.nowJoinedGame
        }
        user.status = onceMore ? UserGameStatus.beforeStart : UserGameStatus.end
        await user.save()
    }
    return {lobbyUrl: settings.lobbyUrl}
})
export default class RouterController {
    @catchError
    static async isLogined(req: Request, res: Response, next: NextFunction) {
        const token = req.query.token;
        const {isValid, payload} = XJWT.decode(token);
        if(isValid) {
            console.log('isLogined, succeeded')
            if (!req.isAuthenticated()) {
                const key = payload.id
                let user = await User.findOne({ unionId: key })
                if (!user) {
                    user = new User({
                        unionId: key
                    })
                    await user.save()
                }
                await cbToPromise(req.logIn.bind(req))(user)
            }
            next()
        } else {
            console.log('isLogined, failed')
            if (req.isAuthenticated()) {
                req.logOut();
            }
            res.redirect(`${settings.rootname}/signIn`);
        }
    }

    @catchError
    static async renderIndex(req: Request, res: Response, next: NextFunction) {
        // res.send('index html todo')
        res.sendfile(path.resolve(__dirname, './dist/index.html'))
    }

    @catchError
    static async renderSignIn(req: Request, res: Response, next: NextFunction) {
        res.send('index sign in todo')
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
    // console.log(Object.keys(data), 'passport', data.socket.handshake)
    cb(null, true)
}

export function handleSocketPassportFailed(data, msg, error, cb) {
    console.error(error, 'error')
    cb(null, true)
}

export function handleSocketInit(ioServer: Socket.Server) {
    ioServer.on('connection', function (socket) {
        console.log('connected')
        const user = socket.request.user
        if (socket.request.isAuthenticated()) {
            pushUserSocket(user._id, socket.id)
        }
        socket.on(serverSocketListenEvents.reqStartGame, async function (msg) {
            try {
                console.log('req Start msg: ');
                console.log(msg)
                if (!socket.request.isAuthenticated()) {
                    console.log('没有登陆')
                    return
                }
                if ([UserGameStatus.beforeStart, UserGameStatus.end].includes(user.status)) {
                    const user = await User.findById(socket.request.user._id)
                    const {isGroupMode, gamePhase} = msg
                    const orderOfPhase = gamePhaseOrder[gamePhase]
                    const unblockPhaseLimit = gamePhaseOrder[user.unblockGamePhase]
                    if (orderOfPhase > unblockPhaseLimit + 1) {
                        return
                    }
                    if (isGroupMode) {
                        joinMatchRoom(gamePhase, user._id)
                        const matchRoom = matchRoomOfGame[gamePhase]
                        user.nowJoinedGame = gamePhase
                        user.status = UserGameStatus.waittingMatch
                        await user.save()
                        socket.emit(clientSocketListenEvnets.startMatch) // TODO
                        if (matchRoom.length === matchRoomLimit) {
                            await emitMatchSuccess(gamePhase, matchRoom)
                            await clearRoom(gamePhase)
                        }
                    } else {
                        user.nowJoinedGame = gamePhase
                        // user.status = UserGameStatus.started
                        await user.save()
                        await emitMatchSuccess(gamePhase, [user._id])
                    }
                }
            } catch (e) {
                console.error(e)
            }

        });
        socket.on(serverSocketListenEvents.leaveMatchRoom, async function () {
            console.log(' req leave room')
            try {
                if (socket.request.isAuthenticated()) {
                    const uid = socket.request.user._id
                    const user = await User.findById(uid)
                    if (user.status === UserGameStatus.waittingMatch) {
                        leaveRoom(user.nowJoinedGame, user._id)
                        user.status = UserGameStatus.beforeStart
                        await user.save()
                    }
                   
                }
            } catch (e) {
                console.error(e)
            }
           
        })
        socket.on('disconnect',async function () {
            console.log('dis connect')
            try {
                if (socket.request.isAuthenticated()) {
                    const uid = socket.request.user._id
                    const userSockets = removeUserSocket(uid, socket.id)                
                    
                    if (userSockets.length === 0) {
                        const user = await User.findById(uid)
                        if (user.status === UserGameStatus.waittingMatch) {
                            leaveRoom(user.nowJoinedGame, user._id)
                            user.status = UserGameStatus.beforeStart
                            await user.save()
                        }
                    }
                   
                }
            } catch (e) {
                console.error(e)
            }
           
        })
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