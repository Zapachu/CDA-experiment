'use strict'

import * as httpProxy from "http-proxy-middleware"
import {rewriteResBuffers} from "./RewriteResBuffers"
import {elfSetting as settings} from 'elf-setting'
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
