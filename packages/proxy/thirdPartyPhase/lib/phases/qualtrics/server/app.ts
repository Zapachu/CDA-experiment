import * as express from 'express'
import * as errorhandler from 'errorhandler'
import '../../common/auth/passport'
import {ConDB, PassportMiddleware, SessionSetMiddleware, StaticPathMiddleware} from '../../common/utils'
import {InitWork, ProxyWork, RPCWork} from './utils'
import settings from '../../../config/settings'
const {qualtricsPort, qualtricsRootName} = settings


ConDB()

const app = express()

SessionSetMiddleware(app)
PassportMiddleware(app)
StaticPathMiddleware(app, qualtricsRootName)

InitWork(app)
ProxyWork(app)
RPCWork()


app.use(errorhandler())
app.listen(qualtricsPort, () => {
    console.log(`listening at ${qualtricsPort}`)
})