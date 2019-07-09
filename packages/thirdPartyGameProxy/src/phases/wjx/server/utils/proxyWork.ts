'use strict'

import * as httpProxy from "http-proxy-middleware"
import {proxyTarget} from '../../../common/config'

const proxy = httpProxy({
    target: proxyTarget.wjxServer,
    ws: true,
    changeOrigin: true,
    autoRewrite: true,
    protocolRewrite: 'http',
    cookieDomainRewrite: "www.wjx.cn",
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Origin', 'https://www.wjx.cn')
        proxyReq.setHeader('referer', 'https://www.wjx.cn/jq/' + req.headers.referer.split('/jq/')[1])
    },
    pathRewrite: (path, req) => path.replace(/&hlv=*(\S*)&jqnonce/g, '&hlv=1&jqnonce')
})

const ProxyWork = (app) => {
    app.use(proxy)
}

export {
    ProxyWork
}