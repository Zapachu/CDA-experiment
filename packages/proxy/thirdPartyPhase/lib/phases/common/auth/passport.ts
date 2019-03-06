import * as passport from 'passport'
import {Model} from 'elf-protocol'

passport.serializeUser(function (user:{id: string}, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    Model.UserModel.findById(id, function (err, user) {
        done(err, user)
    })
})