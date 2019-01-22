import * as passport from 'passport'
import {UserModel, UserDoc} from "@server-model"
import {Strategy} from 'passport-local'
import {baseEnum} from '@common'

passport.serializeUser<UserDoc, string>(function (user, done) {
    done(null, user.id)
})
passport.deserializeUser<UserDoc, string>(function (id, done) {
    UserModel.findById(id, (err, user) => {
        done(err, user)
    })
})

passport.use(baseEnum.PassportStrategy.local, new Strategy({
    usernameField: 'mobile',
    passwordField: 'mobile'
}, function (mobile, password, done) {
    const result = true
    if (result) {
        UserModel.findOne({mobile}).then(user => {
            done(null, user)
        })
    } else {
        done(null, false)
    }
}))


