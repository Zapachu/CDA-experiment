import Socket from 'socket.io'
import passport from 'passport'
import { Request, Response, NextFunction } from 'express'
import socketEmitter from 'socket.io-emitter'

import { User } from './models'
import { UserDoc } from './interfaces'
import settings from './settings'
import {Phase, reqPlayerUrl} from '../protocol'
import { ResCode, serverSocketListenEvents, clientSocketListenEvnets, UserGameStatus } from './enums'
// import {} from '../protocol'

const ioEmitter = socketEmitter({ host: settings.redishost, port: settings.redisport })
const a = ioEmitter
console.log(a)
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

const matchRoomLimit = 15
const waittingTime = 30 // 秒
const matchRoom = [] // uids

const joinMatchRoom = (uid) => {
    matchRoom.push(uid)
}
const leaveRoom = (uid) => {
    const findIndex = matchRoom.findIndex(i => i === uid)
    if (findIndex > -1) {
        matchRoom.splice(findIndex, 1)
    }
}

const emitMatchSuccess = async (uids = []) => {
    const playerUrls = await reqPlayerUrl(uids)
    uids.forEach((uid, index) => {
        const arr = userSocketMap[uid] || []
        const playerUrl = playerUrls[index]
        arr.forEach(socketId => {
            ioEmitter.to(socketId).emit(clientSocketListenEvnets.startGame, {playerUrl })
        })
    })
}
export default class RouterController {
    @catchError
    static async isLogined(req: Request, res: Response, next: NextFunction) {
        if (!req.isAuthenticated()) {
            const key = req.sessionID
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
    }

    @catchError
    static async renderIndex(req: Request, res: Response, next: NextFunction) {
        res.send('index html todo')
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
        console.log('connect123', socket.handshake.session, socket.request.user)
        const user = socket.request.user
        if (socket.request.isAuthenticated()) {
            pushUserSocket(user._id, socket.id)
        }
        socket.on(serverSocketListenEvents.reqStartGame, async function (msg) {
            try {
                console.log('message: ');
                console.log(msg)
                socket.send('hi')
                if (!socket.request.isAuthenticated()) {
                    console.log('没有登陆')
                    return
                }
                if (user.status === UserGameStatus.beforeStart) {
                    const user = await User.findById(socket.request.user._id)
                    const {isGroupMode, gameType} = msg
                    if (isGroupMode) {
                        joinMatchRoom(user._id)
                        user.nowJoinedGame = gameType
                        user.status = UserGameStatus.waittingMatch
                        await user.save()
                        if (matchRoom.length === matchRoomLimit) {
                            await emitMatchSuccess(matchRoom)
                        }
                    } else {
                        user.nowJoinedGame = gameType
                        user.status = UserGameStatus.started
                        await user.save()
                        await emitMatchSuccess([user._id])
                    }
                }
            } catch (e) {
                console.error(e)
            }

        });
        socket.on('disconnect',async function (socket) {
            console.log('dis connect')
            try {
                if (socket.request.isAuthenticated()) {
                    const uid = socket.request.user._id
                    const userSockets = removeUserSocket(uid, socket.id)                
                    
                    if (userSockets.length === 0) {
                        const user = await User.findById(uid)
                        if (user.status === UserGameStatus.waittingMatch) {
                            leaveRoom(user._id)
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