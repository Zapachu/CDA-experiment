const express = require('express')
import * as errorhandler from 'errorhandler'
import * as httpProxy from 'http-proxy-middleware'
import { Response, Request } from 'express'

const app = express()


let proxy = httpProxy({
    target: 'https://www.wjx.cn',
    changeOrigin: true,
    ws: true,
    autoRewrite: true,
    protocolRewrite: 'http'
})

app.use((req: Request, res: Response, next) => {
    if (req.url.indexOf('complete') !== -1) {
        return res.redirect('https://bing.com')
    }
    next()
})

app.use(proxy)
app.use(errorhandler())
const server = app.listen(3072, () => {
    console.log('listening at ', server.address().port)
})