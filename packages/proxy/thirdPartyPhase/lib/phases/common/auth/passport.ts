import * as passport from 'passport'
import {model} from 'mongoose'
import {getModels} from 'elf-protocol'

passport.serializeUser(function (user:{id: string}, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    getModels(model).User.findById(id, function (err, user) {
        done(err, user)
    })
})