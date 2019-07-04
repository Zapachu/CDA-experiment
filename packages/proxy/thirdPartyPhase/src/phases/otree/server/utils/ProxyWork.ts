'use strict'

import * as httpProxy from "http-proxy-middleware"
import {elfSetting as settings} from 'elf-setting'
import {rewriteResBuffers} from "./RewriteResBuffers"

const otreePlayUrl = settings.oTreeServer

const proxy = httpProxy({
    target: otreePlayUrl,
    xfwd:true,
    ws: true,
    autoRewrite: true,
    protocolRewrite: 'http',
    onProxyRes: rewriteResBuffers
})

export const ProxyWork = (app) => {
    app.use(proxy)
}
