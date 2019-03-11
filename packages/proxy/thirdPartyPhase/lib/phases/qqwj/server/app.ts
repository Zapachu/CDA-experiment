import * as Express from 'express'
import * as errorhandler from 'errorhandler'
import '../../common/auth/passport'
import settings from '../../../config/settings'
import {InitWork, ProxyWork, RPCWork} from './utils'
const {qqSurveyStaticNamespace, qqSurveyPort} = settings

import {ConDB, SessionSetMiddleware, PassportMiddleware, StaticPathMiddleware} from '../../common/utils'

ConDB()

const app = Express()

SessionSetMiddleware(app)
PassportMiddleware(app)
StaticPathMiddleware(app, qqSurveyStaticNamespace)

InitWork(app)
ProxyWork(app)
RPCWork()

app.use(errorhandler())
app.listen(3073, () => {
    console.log(`listening at ${qqSurveyPort}`)
})
