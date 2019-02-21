'use strict'

import '../auth/passport'
import * as passport from 'passport'
import {UserModel} from '../../../core/server/models'

passport.serializeUser(function (user, done) {
    // @ts-ignore
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
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