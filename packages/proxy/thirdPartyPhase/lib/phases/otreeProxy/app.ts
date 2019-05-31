'use strict'

import * as Express from 'express'
import {
    SessionSetMiddleware,
    ConDB,
    PassportMiddleware,
    useLog,
    useBodyParser,
} from '../common/utils'
import {configs} from './config'
import {router} from './routes'

const app = Express()

ConDB()
SessionSetMiddleware(app)
PassportMiddleware(app)
useLog(app)
useBodyParser(app)


app.use('/', router)

app.listen(configs.otreeProxyPort, () => console.log(`Start At ${configs.otreeProxyPort}`))
