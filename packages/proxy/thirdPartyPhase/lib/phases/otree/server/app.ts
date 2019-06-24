import * as Express from 'express'
import * as errorHandler from 'errorhandler'
import * as path from 'path'
import {elfSetting} from 'elf-setting'
import '../../common/auth/passport'
import {routePrefix} from '../../common/config'
import {withLinker} from '../../../core/server/util'
import {getUrlByNamespace, InitWork, ProxyWork} from './utils'

import {
    ConDB,
    PassportMiddleware,
    SessionSetMiddleware,
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
withLinker(elfSetting.oTreeNamespace, elfSetting.oTreeProxy, getUrlByNamespace)

app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, './views'))
app.use(errorHandler())
app.listen(port, () => console.log(`listening at ${port}`))
