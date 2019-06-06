import * as express from 'express'
import * as errorhandler from 'errorhandler'
import '../../common/auth/passport'
import {routePrefix} from '../../common/config'
import {ConDB, PassportMiddleware, SessionSetMiddleware, StaticPathMiddleware} from '../../common/utils'
import {getUrlByNamespace, InitWork, ProxyWork} from './utils'
import {withLinker} from '../../../core/server/util'
import {elfSetting as settings} from 'elf-setting'

const {qualtricsPort} = settings


ConDB()

const app = express()

SessionSetMiddleware(app)
PassportMiddleware(app)
StaticPathMiddleware(app, routePrefix.qualtricsStaticNamespace)

InitWork(app)
ProxyWork(app)
withLinker('qualtrics', settings.qualtricsProxy, getUrlByNamespace)

app.use(errorhandler())
app.listen(qualtricsPort, () => {
    console.log(`listening at ${qualtricsPort}`)
})
