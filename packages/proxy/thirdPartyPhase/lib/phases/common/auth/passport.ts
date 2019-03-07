import * as passport from 'passport'
import {model} from 'elf-protocol'

passport.serializeUser(function (user:{id: string}, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    model.UserModel.findById(id, function (err, user) {
        done(err, user)
    })
})