import * as Express from 'express'
import * as errorhandler from 'errorhandler'
import '../../common/auth/passport'
import settings from '../../../config/settings'
import {InitWork, ProxyWork, RPCWork} from './utils'
const {qqwjRootName, qqwjPort} = settings

import {ConDB, SessionSetMiddleware, PassportMiddleware, StaticPathMiddleware} from '../../common/utils'

ConDB()

const app = Express()

SessionSetMiddleware(app)
PassportMiddleware(app)
StaticPathMiddleware(app, qqwjRootName)

InitWork(app)
ProxyWork(app)
RPCWork()

app.use(errorhandler())
app.listen(3073, () => {
    console.log(`listening at ${qqwjPort}`)
})