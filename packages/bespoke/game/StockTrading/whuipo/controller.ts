import Socket from 'socket.io'
import passport from 'passport'
import {Request, Response, NextFunction} from 'express'

import { User } from './models'
import { UserDoc } from './interfaces'
import {ResCode} from './enums'

passport.serializeUser(function (user: UserDoc, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

function catchError (target: any, key: string, descriptor: PropertyDescriptor) {
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

export default class RouterController {
    @catchError
    static async isLogined (req: Request, res: Response, next: NextFunction) {
        if (!req.isAuthenticated()) {
            const key = req.sessionID
            let user = await User.findOne({unionId: key})
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
    static async renderIndex (req: Request, res: Response, next: NextFunction) {
        res.send('index html todo')
    }
}

export function handleSocketInit(io: Socket.Server) {
    
}


function cbToPromise (func) {
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