import * as errorhandler from 'errorhandler'
import {elfSetting as settings} from '@elf/setting'
import '../../common/auth/passport'
import {routePrefix} from '../../common/config'
import {getUrlByNamespace, InitWork, ProxyWork} from './utils'
import {ConDB, PassportMiddleware, SessionSetMiddleware, StaticPathMiddleware} from '../../common/utils'
import {withLinker} from '../../../core/server/util'

import * as Express from 'express'

ConDB()

const app = Express()
const {wjxPort} = settings

SessionSetMiddleware(app)
PassportMiddleware(app)
StaticPathMiddleware(app, routePrefix.wjxStaticNamespace)

InitWork(app)
ProxyWork(app)
withLinker('wjx', settings.wjxProxy, getUrlByNamespace)

app.use(errorhandler())
app.listen(wjxPort, () => {
    console.log(`listening at ${wjxPort}`)
})
