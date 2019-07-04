import * as Express from 'express'
import * as errorHandler from 'errorhandler'
import * as path from 'path'
import {elfSetting} from '@elf/setting'
import {readFileSync} from 'fs'
import {virtualJsRoute} from './config'
import '../../common/auth/passport'
import {routePrefix} from '../../common/config'
import {withLinker} from '../../../core/server/util'
import {getUrlByNamespace, InitWork, ProxyWork, getDemoList} from './utils'

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
const manifest = JSON.parse(readFileSync(path.resolve(__dirname, '../../../../dist/manifest.json')).toString())
withLinker(elfSetting.oTreeNamespace, elfSetting.oTreeProxy, getUrlByNamespace, `${elfSetting.oTreeProxy}${manifest['otree.js']};${elfSetting.oTreeProxy}/${routePrefix.oTreeStaticPathNamespace}${virtualJsRoute}`)

app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, './views'))
app.use(errorHandler())
app.listen(port, () => {
    console.log(`listening at ${port}`)
    getDemoList(elfSetting.oTreeNamespace).catch(e=>console.error(e))
})
