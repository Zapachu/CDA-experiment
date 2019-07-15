const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const errorhandler = require('errorhandler')
const httpProxy = require('http-proxy-middleware')
const app = express()
const path = require('path')


import {Response, Request} from 'express'

/**
 * 代理 3070 到 3005 并 截取 流量
 */

let proxy = httpProxy({
    target: 'http://127.0.0.1:3005',
    ws: true
})

app.use((req: Request, res: Response, next) => {
    if (req.path.indexOf('OutOfRangeNotification') != -1) {

        /**
         * 获取玩家 otree play hash
         * 在 OtreePhase 中找到 该 player 并 获取 phase， 然后转回 Game 服务  hash
         */
        let playerOtreeHash = req.headers.referer.split('/p/')[1].split('/')[0]
        
        // done this step


        console.log(playerOtreeHash)
    }
    // log.info(req)
    // log.info(res)
    next()
})

app.use(proxy)

app.use(errorhandler())
const server = app.listen(3070, () => {
    console.log('listening at ', server.address().port)
})

// OutOfRangeNotification/