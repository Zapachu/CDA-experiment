'use strict'

import * as zlib from "zlib"
const {Gzip} = require('zlib')
import {generateInsertScript} from "./generateInsertScript"
import {getNextPhaseUrl} from "./getNextPhaseUrl"

const rewriteResBuffers = async (proxyRes, req, res) => {
    const isInit = req.url.includes('/init')
    const isDev = req.url.includes('.js.map')
    const isSurvey = req.url.includes('/jfe/form')
    const isGet = req.method === 'GET'

    console.log(`${req.method} ${req.url}`)
    if (!isInit && !isDev && isSurvey && isGet) {
        console.log('Rewrite Buffer')
        const originWrite = res.write
        const originEnd = res.end

        res.setHeader('content-encoding', 'gzip')
        res.setHeader('content-type', 'text/html; charset=utf-8')
        let buffers = []
        res.write = (chunk) => {
            console.log('log > got buffer..')
            buffers.push(chunk)
            return true
        }
        res.end = () => {
            console.log("log > got end")
            let fullChunk = Buffer.concat(buffers)
            console.log(fullChunk)
            zlib.unzip(fullChunk, {
                finishFlush: zlib.constants.Z_SYNC_FLUSH,
                flush: zlib.Z_SYNC_FLUSH,
            }, async (err, buffer) => {
                if (!err) {

                    let gzipStream = Gzip()
                    const insert_scripts = generateInsertScript(await getNextPhaseUrl(req))

                    gzipStream.on('data', chunk => {
                        console.log('log > write gziped buffer')
                        originWrite.call(res, chunk)
                        gzipStream.end()
                    })
                    gzipStream.on('end', () => {
                        console.log('log > write gziped buffer end')
                        originEnd.call(res)
                    })

                    const data = buffer.toString()
                    const dataStart = data.split('</body>')[0]
                    const dataEnd = data.split('</body>')[1]
                    const newData = dataStart + insert_scripts + dataEnd
                    console.log('log > new html produced')
                    gzipStream.write(new Buffer(newData))
                } else {
                    console.log(err)
                }
            })
        }
    }
}

export {
    rewriteResBuffers
}