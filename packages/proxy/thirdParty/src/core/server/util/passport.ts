import * as passport from 'passport'
import {UserModel} from '../models'

passport.serializeUser(function (user:{id: string}, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
        done(err, user)
    })
})


