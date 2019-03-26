'use strict'

import * as httpProxy from "http-proxy-middleware"
import {rewriteResBuffers} from './RewriteResBuffers'
import {proxyTarget} from '../../../common/config'

const proxy = httpProxy({
    target: proxyTarget.qqwjServer,
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
