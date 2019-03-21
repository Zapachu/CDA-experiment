import * as Express from 'express'
import * as errorhandler from 'errorhandler'
import '../../common/auth/passport'
import {elfSetting as settings} from 'elf-setting'
import {InitWork, ProxyWork, RPCWork} from './utils'
const {qqwjStaticNamespace, qqwjPort} = settings

import {ConDB, SessionSetMiddleware, PassportMiddleware, StaticPathMiddleware} from '../../common/utils'

ConDB()

const app = Express()

SessionSetMiddleware(app)
PassportMiddleware(app)
StaticPathMiddleware(app, qqwjStaticNamespace)

InitWork(app)
ProxyWork(app)
RPCWork()

app.use(errorhandler())
app.listen(3073, () => {
    console.log(`listening at ${qqwjPort}`)
})
