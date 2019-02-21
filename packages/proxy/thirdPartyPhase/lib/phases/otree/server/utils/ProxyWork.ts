'use strict'

import * as httpProxy from "http-proxy-middleware"
import settings from '../../../../config/settings'
import {rewriteResBuffers} from "./RewriteResBuffers"

const otreePlayUrl = settings.otreeServerRootUrl

const proxy = httpProxy({
    target: otreePlayUrl,
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