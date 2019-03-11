'use strict'

import * as httpProxy from "http-proxy-middleware"
import settings from "../../../../config/settings"
import {rewriteResBuffers} from './RewriteResBuffers'
const {qqSurveyServer} = settings

const proxy = httpProxy({
    target: qqSurveyServer,
    changeOrigin: true,
    ws: true,
    autoRewrite: true,
    protocolRewrite: 'http',
    onProxyRes: rewriteResBuffers
})

const ProxyWork = (app) => {
    app.use(proxy)
}

export {
    ProxyWork
}
