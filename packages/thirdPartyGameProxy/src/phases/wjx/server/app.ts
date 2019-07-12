import * as errorHandler from 'errorhandler'
import {elfSetting} from '@elf/setting'
import '../../common/auth/passport'
import {routePrefix} from '../../common/config'
import {getUrlByNamespace, InitWork, NAMESPACE, ProxyWork} from './utils'
import {ConDB, PassportMiddleware, SessionSetMiddleware, StaticPathMiddleware} from '../../common/utils'
import {withLinker} from '../../../core/server/util'

import * as Express from 'express'

ConDB()

const app = Express()
const {wjxPort} = elfSetting

SessionSetMiddleware(app)
PassportMiddleware(app)
StaticPathMiddleware(app, routePrefix.wjxStaticNamespace)

InitWork(app)
ProxyWork(app)
withLinker(NAMESPACE, elfSetting.wjxProxy, getUrlByNamespace)

app.use(errorHandler())
app.listen(wjxPort, () => {
    console.log(`listening at ${wjxPort}`)
})
