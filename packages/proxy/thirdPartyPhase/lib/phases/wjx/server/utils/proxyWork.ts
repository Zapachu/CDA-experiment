'use strict'

import * as httpProxy from "http-proxy-middleware"
import settings from "../../../../config/settings"

const {WjxServerRootUrl} = settings

const proxy = httpProxy({
    target: WjxServerRootUrl,
    ws: true,
    changeOrigin: true,
    autoRewrite: true,
    protocolRewrite: 'http'
})

const ProxyWork = (app) => {
    app.use(proxy)
}

export {
    ProxyWork
}