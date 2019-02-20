import '../../../../registerTsconfig'
import * as zlib from 'zlib'
import * as httpProxy from 'http-proxy-middleware'
import {Response, Request, NextFunction} from 'express'
import {serve as serveRPC} from './rpcService'
import {getGameService, settings, Server, ThirdPartPhase} from '@core/server'

const {Gzip} = require('zlib')
const QUALTRICS = {
    PLAY_URL: settings.qualtricsServerRootUrl,
    PROXY_SERVER: settings.qualtricsPhaseServerPrefix
}

const express = Server.start(3071, settings.qualtricsRootName)

const getNextPhaseUrl = async (req) => {
    console.log('log > req.url ', req.url)
    const qualtricsHash = req.url.split('/jfe/form/')[1]
    console.log('log > qualtrics hash ', qualtricsHash)
    const qualtricsPhase: any = await ThirdPartPhase.findOne({
        namespace: 'qualtrics',
        playHashs: {$elemMatch: {hash: qualtricsHash}}
    })
    console.log('log > qualtrics phase', qualtricsPhase)
    const paramsJson = JSON.parse(qualtricsPhase.param)
    const request = {
        groupId: qualtricsPhase.groupId,
        nextPhaseKey: paramsJson.nextPhaseKey || -1,
        playerToken: paramsJson.palyerCode || qualtricsPhase.playHashs[0].player,
        playUrl: `${QUALTRICS.PROXY_SERVER}/init/jfe/form/${qualtricsPhase._id.toString()}`
    }

    return await new Promise((resolve, reject) => {
        console.log(request)
        getGameService().sendBackPlayer(request, (err: {}, service_res: { sendBackUrl: string }) => {
            if (err) {
                console.log(err)
            }
            console.log('log > service_res', service_res)
            const nextPhaseUrl = service_res.sendBackUrl
            resolve(nextPhaseUrl)
        })
    })
}

const proxy = httpProxy({
    target: QUALTRICS.PLAY_URL,
    ws: true,
    changeOrigin: true,
    autoRewrite: true,
    protocolRewrite: 'http',
    onProxyRes: async (proxyRes, req, res) => {

        console.log('log > requst info:', req.url, req.method)

        if (!req.url.includes('/init') && !req.url.includes('.js.map') && req.url.includes('/jfe/form') && req.method === 'GET') {

            const originWrite = res.write
            const originEnd = res.end

            res.setHeader('content-encoding', 'gzip')
            res.setHeader('content-type', 'text/html; charset=utf-8')
            let buffers = []
            res.write = (chunk) => {
                console.log('log > got buffer from proxyRes')
                buffers.push(chunk)
                return true
            }
            res.end = () => {
                console.log('log > got end')
                let fullChunk = Buffer.concat(buffers)
                console.log(fullChunk)
                zlib.unzip(fullChunk, {
                    finishFlush: zlib.constants.Z_SYNC_FLUSH,
                    flush: zlib.Z_SYNC_FLUSH
                }, async (err, buffer) => {
                    if (!err) {

                        const nextPhaseUrl = await getNextPhaseUrl(req)
                        let gzipStream = Gzip()
                        const insert_scripts = `
                            <script>
                                (function () {
                                    setInterval(() => {
                                        console.log('debug: find end sign')
                                        if (document.getElementById('EndOfSurvey')) {
                                            window.location.href = '${nextPhaseUrl}'
                                        }
                                    }, 2000)
                                })()
                            </script>
                        `

                        gzipStream.on('data', chunk => {
                            console.log('log > write gziped buffer')
                            originWrite.call(res, chunk)
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
                        gzipStream.end()
                    } else {
                        console.log(err)
                    }
                })
            }
        }
    }
})

express.use(async (req: Request, res: Response, next: NextFunction) => {


    // 非登录用户禁止访问
    if (!req.user) {
        return res.redirect('https://ancademy.org')
    }

    req.header['Accept-Encoding'] = 'gzip'

    // 用户访问问卷
    if (req.path.indexOf('/init/jfe/form') !== -1 && req.method === 'GET') {
        console.log('log > Starting init.....')
        const currentUserElfGameHash = req.query.token
        console.log('log > current Elf hash ....', currentUserElfGameHash)
        const currentPhaseId = req.url.split('/jfe/form/')[1].slice(0, 24)
        try {
            const currentPhase: any = await ThirdPartPhase.findById(currentPhaseId)
            const currentPhaseParamsJson = JSON.parse(currentPhase.param)
            const currentPhaseSurveyId = currentPhaseParamsJson.qualtricsHash

            // 访问不存在的phase
            if (!currentPhase) {
                return res.redirect('https://ancademy.org')
            }

            console.log('log > find phase object...')
            console.log(currentPhase)

            const {playHashs} = currentPhase

            let redirectTo = null

            for (let i = 0; i < playHashs.length; i++) {
                if (playHashs[i].player.toString() === currentUserElfGameHash.toString()) {
                    redirectTo = `${QUALTRICS.PROXY_SERVER}/jfe/form/${currentPhaseSurveyId}`
                }
            }

            if (redirectTo) {
                return res.redirect(redirectTo)
            }

            // 新加入成员
            playHashs.push({hash: currentPhaseSurveyId, player: currentUserElfGameHash})
            currentPhase.playHashs = playHashs
            currentPhase.markModified('playHashs')
            await currentPhase.save()
            return res.redirect(`${QUALTRICS.PROXY_SERVER}/jfe/form/${currentPhaseSurveyId}`)
        } catch (err) {
            if (err) {
                console.log(err)
                return res.redirect('https://ancademy.org')
            }
        }

        next()
    }

    next()
})

express.use(proxy)

serveRPC()