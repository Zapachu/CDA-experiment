import * as passport from 'passport'
import {Express} from 'express'
import {UserModel, UserDoc} from '@server-model'

export function usePassport(express:Express) {
    passport.serializeUser<UserDoc, string>(function (user, done) {
        done(null, user.id)
    })
    passport.deserializeUser<UserDoc, string>(function (id, done) {
        UserModel.findById(id, function (err, user) {
            done(err, user)
        })
    })
    express.use(passport.initialize())
    express.use(passport.session())
}
