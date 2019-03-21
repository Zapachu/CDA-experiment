import * as errorhandler from 'errorhandler'
import {elfSetting as settings} from 'elf-setting'
import '../../common/auth/passport'
import {InitWork, ProxyWork, RPCWork} from './utils'
import {ConDB, SessionSetMiddleware, PassportMiddleware, StaticPathMiddleware} from '../../common/utils'

import * as Express from 'express'

ConDB()

const app = Express()
const {wjxPort, wjxStaticNamespace} = settings

SessionSetMiddleware(app)
PassportMiddleware(app)
StaticPathMiddleware(app, wjxStaticNamespace)

InitWork(app)
ProxyWork(app)
RPCWork()

app.use(errorhandler())
app.listen(wjxPort, () => {
    console.log(`listening at ${wjxPort}`)
})
