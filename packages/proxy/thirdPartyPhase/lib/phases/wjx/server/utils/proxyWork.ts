'use strict'

import * as httpProxy from "http-proxy-middleware"
import {elfSetting as settings} from 'elf-setting'

const {wjxServer} = settings

const proxy = httpProxy({
    target: wjxServer,
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
