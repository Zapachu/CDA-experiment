'use strict'

import * as zlib from "zlib"
const {Gzip} = require('zlib')
import {ErrorPage} from '../../../common/utils'
import {getNextPhaseUrl} from './getNextPhaseUrl'
import {generateInsertScript} from './generateInsertScripts'

const rewriteResBuffers = async (proxyRes, req, res) => {
    const isGet = req.method === 'GET'
    const isMain = req.url.includes('/s2/')
    const isInit = req.url.includes('/init/')
    const isDev = req.url.includes('performance-now.js.map')

    const phaseId =  req.session.qqwjPhaseId
    if (!phaseId) return ErrorPage(res, "Wrong Phase")

    const isSubmit = req.url.includes('sur/collect_answer')
    if (isSubmit) {
        console.log(req.body)
        console.log(req)
    }

    if (isGet && isMain && !isInit && !isDev) {
        const originWrite = res.write
        const originEnd = res.end
        let gzipStream = Gzip()
        let buffers = []
        res.write = (chunk) => {
            buffers.push(chunk)
            return true
        }
        res.end = () => {
            let fullChunk = Buffer.concat(buffers)
            zlib.unzip(fullChunk, {finishFlush: zlib.constants.Z_SYNC_FLUSH}, async (err, buffer) => {
                if (!err) {
                    gzipStream.on('data', chunk => {
                        originWrite.call(res, chunk)
                        gzipStream.end()
                    })
                    gzipStream.on('end', () => {
                        originEnd.call(res)
                    })
                    const data = buffer.toString()
                    const dataStart = data.split('<head>')[0]
                    const dataEnd = data.split('<head>')[1]
                    const newData = dataStart + '<head>' + generateInsertScript(await getNextPhaseUrl(req)) + dataEnd
                    const removeSafePart = newData.replace('<script src="//js.aq.qq.com/js/aq_common.js"></script>', '')
                    gzipStream.write(new Buffer(removeSafePart))
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
