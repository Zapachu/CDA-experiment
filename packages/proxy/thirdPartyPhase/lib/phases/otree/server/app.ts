import * as Express from 'express'
import * as errorHandler from 'errorhandler'
import {elfSetting} from 'elf-setting'
import '../../common/auth/passport'
import {routePrefix} from '../../common/config'
import {ProxyWork, RPCWork, InitWork} from './utils'
import {
    ConDB,
    SessionSetMiddleware,
    PassportMiddleware,
    SessionTokenCheck,
    StaticPathMiddleware
} from '../../common/utils'

const {oTreePort: port} = elfSetting

const app = Express()

ConDB()
StaticPathMiddleware(app, routePrefix.oTreeStaticPathNamespace)
SessionSetMiddleware(app)
PassportMiddleware(app)
SessionTokenCheck(app)
InitWork(app)
ProxyWork(app)
RPCWork()

app.use(errorHandler())
app.listen(port, () => console.log(`listening at ${port}`))
