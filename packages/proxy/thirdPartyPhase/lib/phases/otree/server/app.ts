import * as Express from 'express'
import * as errorhandler from 'errorhandler'

import {ProxyWork, RPCWork, InitWork} from './utils'
import {ConDB, SessionSetMiddleware, PassportMiddleware, StaticPathMiddleware, SessionTokenCheck} from '../../common/utils'

import '../../common/auth/passport'
import settings from '../../../config/settings'

const {otreeRootName: namespace, otreePort: port} = settings

const app = Express()

ConDB()
SessionSetMiddleware(app)
PassportMiddleware(app)
StaticPathMiddleware(app, namespace)

SessionTokenCheck(app)
InitWork(app)
ProxyWork(app)

RPCWork()

app.use(errorhandler())
app.listen(port, () => console.log(`listening at ${port}`))
