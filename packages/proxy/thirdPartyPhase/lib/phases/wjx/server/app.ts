import * as errorhandler from 'errorhandler'
import {elfSetting as settings} from 'elf-setting'
import '../../common/auth/passport'
import {routePrefix} from '../../common/config'
import {InitWork, ProxyWork, RPCWork} from './utils'
import {ConDB, SessionSetMiddleware, PassportMiddleware, StaticPathMiddleware} from '../../common/utils'

import * as Express from 'express'

ConDB()

const app = Express()
const {wjxPort} = settings

SessionSetMiddleware(app)
PassportMiddleware(app)
StaticPathMiddleware(app, routePrefix.wjxStaticNamespace)

InitWork(app)
ProxyWork(app)
RPCWork()

app.use(errorhandler())
app.listen(wjxPort, () => {
    console.log(`listening at ${wjxPort}`)
})
