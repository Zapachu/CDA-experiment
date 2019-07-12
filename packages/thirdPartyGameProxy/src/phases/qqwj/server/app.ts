import * as Express from 'express'
import * as errorhandler from 'errorhandler'
import '../../common/auth/passport'
import {routePrefix} from '../../common/config'
import {elfSetting} from '@elf/setting'
import {getUrlByNamespace, InitWork, ProxyWork, NAMESPACE} from './utils'
import {withLinker} from '../../../core/server/util'
import {ConDB, PassportMiddleware, SessionSetMiddleware, StaticPathMiddleware} from '../../common/utils'

const {qqwjPort} = elfSetting

ConDB()

const app = Express()

SessionSetMiddleware(app)
PassportMiddleware(app)
StaticPathMiddleware(app, routePrefix.qqwjStaticNamespace)

InitWork(app)
ProxyWork(app)
withLinker(NAMESPACE, elfSetting.qqwjProxy, getUrlByNamespace)

app.use(errorhandler())
app.listen(3073, () => {
    console.log(`listening at ${qqwjPort}`)
})
