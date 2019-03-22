import * as Express from 'express'
import * as errorHandler from 'errorhandler'
import {elfSetting} from 'elf-setting'
import '../../common/auth/passport'
import {ProxyWork, RPCWork, InitWork} from './utils'
import {
    ConDB,
    SessionSetMiddleware,
    PassportMiddleware,
    SessionTokenCheck,
    StaticPathMiddleware
} from '../../common/utils'

//region overRideSetting
const {OTREE_PORT, OTREE_RPC, OTREE_PROXY, OTREE_SERVER, NAMESPACE} = process.env
elfSetting.oTreePort = +(OTREE_PORT || elfSetting.oTreePort)
elfSetting.oTreeRpc = OTREE_RPC || elfSetting.oTreeRpc
elfSetting.oTreeProxy = OTREE_PROXY || elfSetting.oTreeProxy
elfSetting.oTreeServer = OTREE_SERVER || elfSetting.oTreeServer
elfSetting.oTreeNodeNamespace = NAMESPACE || elfSetting.oTreeNodeNamespace
//endregion

const {oTreePort: port} = elfSetting

const app = Express()

ConDB()
StaticPathMiddleware(app, elfSetting.oTreeStaticPathNamespace)
SessionSetMiddleware(app)
PassportMiddleware(app)
SessionTokenCheck(app)
InitWork(app)
ProxyWork(app)
RPCWork()

app.use(errorHandler())
app.listen(port, () => console.log(`listening at ${port}`))
