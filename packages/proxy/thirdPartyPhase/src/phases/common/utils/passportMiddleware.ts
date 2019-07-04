'use strict'

import '../auth/passport'
import * as passport from 'passport'
import {model} from 'mongoose'
import {getModels} from '@elf/protocol'

passport.serializeUser(function (user, done) {
    // @ts-ignore
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    getModels(model).User.findById(id, function (err, user) {
        done(err, user);
    });
});

const PassportMiddleware = (app) => {
    app.use(passport.initialize())
    app.use(passport.session())
    app.use((req, res, next) => {
        res.locals.user = req.user
        next()
    })
}

export {
    PassportMiddleware
}