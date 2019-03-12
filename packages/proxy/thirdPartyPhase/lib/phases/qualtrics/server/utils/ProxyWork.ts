'use strict'

import * as httpProxy from "http-proxy-middleware"
import {rewriteResBuffers} from "./RewriteResBuffers"
import settings from "../../../../config/settings"
const {qualtricsServer} = settings

const proxy = httpProxy({
    target: qualtricsServer,
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
