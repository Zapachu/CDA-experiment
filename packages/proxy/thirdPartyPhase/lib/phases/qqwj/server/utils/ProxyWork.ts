'use strict'

import * as httpProxy from "http-proxy-middleware"
import {elfSetting as settings} from 'elf-setting'
import {rewriteResBuffers} from './RewriteResBuffers'
const {qqwjServer} = settings

const proxy = httpProxy({
    target: qqwjServer,
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
