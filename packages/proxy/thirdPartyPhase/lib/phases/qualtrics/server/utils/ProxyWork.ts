'use strict'

import * as httpProxy from "http-proxy-middleware"
import {rewriteResBuffers} from "./RewriteResBuffers"
import settings from "../../../../config/settings"
const {qualtricsServerRootUrl} = settings

const proxy = httpProxy({
    target: qualtricsServerRootUrl,
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