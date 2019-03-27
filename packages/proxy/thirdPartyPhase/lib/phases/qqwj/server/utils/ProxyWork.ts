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
    onProxyRes: rewriteResBuffers,
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('dnt', 1)
        proxyReq.setHeader('Origin', 'https://wj.qq.com')
        proxyReq.setHeader('referer', 'https://wj.qq.com/s2/' + req.headers.referer.split('/s2/')[1])
    },
})

const ProxyWork = (app) => {
    app.use(proxy)
}

export {
    ProxyWork
}
