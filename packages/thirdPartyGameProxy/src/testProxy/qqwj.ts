const express = require('express')

import * as errorhandler from 'errorhandler'
import * as httpProxy from 'http-proxy-middleware'
import { Response, Request } from 'express'
import * as zlib from 'zlib'

const { Gzip } = require('zlib')


const app = express()


let proxy = httpProxy({
    target: 'https://wj.qq.com',
    changeOrigin: true,
    ws: true,
    autoRewrite: true,
    protocolRewrite: 'http',
    onProxyRes: async (proxyRes, req, res) => {
        if (req.url.indexOf('/s/') !== -1 && req.method === 'GET') {
            const originWrite = res.write
            const originEnd = res.end

            res.setHeader('content-encoding', 'gzip')
            res.setHeader('content-type', 'text/html; charset=utf-8')

            const nextPhaseUrl = 'https://bing.com'
            let gzipStream = Gzip()
            const insert_scripts = `
                <script>
                    // Recover setInterval and new a Timer Obejct
                    function Timer(fn, t) {
                        var timerObj = setInterval(fn, t);
                        this.stop = function() {
                            if (timerObj) {
                                clearInterval(timerObj);
                                timerObj = null;
                            }
                            return this;
                        }
                    
                        this.start = function() {
                            if (!timerObj) {
                                this.stop();
                                timerObj = setInterval(fn, t);
                            }
                            return this;
                        }
                    
                        this.reset = function(newT) {
                            t = newT;
                            return this.stop().start();
                        }
                    }
                    (function () {
                        Timer(() => {
                            console.warn('debug: find end sign')
                            if (document.getElementsByClassName('survey_suffix') && $('.survey_suffix').css('display') != 'none') {
                                window.location.href = '${nextPhaseUrl}'
                            }
                        }, 2000)
                    })()
                </script>
            `
            let buffers = []

            res.write = (chunk) => {
                console.log('log > got buffer from proxyRes')
                buffers.push(chunk)
                return true
            }
            res.end = () => {
                console.log("log > got end")
                let fullChunk = Buffer.concat(buffers)
                zlib.unzip(fullChunk, { finishFlush: zlib.constants.Z_SYNC_FLUSH }, (err, buffer) => {
                    if (!err) {
                        gzipStream.on('data', chunk => {
                            console.log('log > write gziped buffer')
                            originWrite.call(res, chunk)
                        })
                        gzipStream.on('end', () => {
                            console.log('log > write gziped buffer end')
                            originEnd.call(res)
                        })

                        const data = buffer.toString()
                        const dataStart = data.split('<head>')[0]
                        const dataEnd = data.split('<head>')[1]
                        const newData = dataStart + '<head>' + insert_scripts + dataEnd

                        const removeSafePart = newData.replace('<script src="//js.aq.qq.com/js/aq_common.js"></script>', '')
                        gzipStream.write(new Buffer(removeSafePart))
                        gzipStream.end()
                    } else {
                        console.log(err)
                    }
                })
            }
        }
    }
})

app.use((req: Request, res: Response, next) => {

    req.headers = Object.assign(req.headers, {
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9',
        'origin': 'https://wj.qq.com',
        'referer': 'https://wj.qq.com/s/2831201/232f/'
    })
    console.log(req.headers)

    if (req.url.indexOf('accessibility_report') !== -1) {
        console.log('log >>> accessibility_report')
    }

    if (req.url.indexOf('mo_push') !== -1) {
        console.log('log >>> mo_push')
    }

    next()
})

app.use(proxy)
app.on('error', (err, req, res) => {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });

    res.end('Something went wrong. And we are reporting a custom error message.');
});
app.use(errorhandler())
const server = app.listen(3073, () => {
    console.log('listening at ', server.address().port)
})