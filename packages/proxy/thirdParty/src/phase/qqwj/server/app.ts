import * as errorHandler from 'errorhandler'
import * as httpProxy from 'http-proxy-middleware'
import {Response, Request, NextFunction} from 'express'
import {serve as serveRPC} from './rpcService'
import {settings, getGameService, ThirdPartPhase, Server} from '@core/server'
import * as zlib from 'zlib'

const {Gzip} = require('zlib')

const express = Server.start(3073, settings.qqwjRootName)

const getNextPhaseUrl = async (qqwjHash) => {
    console.log('log > qqwj hash ', qqwjHash)
    const qqwjPhase: any = await ThirdPartPhase.findOne({
        namespace: 'qqwj',
        playHashs: {$elemMatch: {hash: qqwjHash}}
    })
    console.log('log > qqwj phase', qqwjPhase)
    const paramsJson = JSON.parse(qqwjPhase.param)
    const request = {
        groupId: qqwjPhase.groupId,
        nextPhaseKey: paramsJson.nextPhaseKey || -1,
        playerToken: paramsJson.palyerCode || qqwjPhase.playHashs[0].player,
        playUrl: `${settings.qqwjPhaseServerPrefix}/init/qqwj/${qqwjPhase._id.toString()}`
    }

    return await new Promise((resolve, reject) => {
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
    target: settings.qqwjServerRootUrl,
    ws: true,
    changeOrigin: true,
    autoRewrite: true,
    protocolRewrite: 'http',
    onProxyRes: async (proxyRes, req, res) => {
        if (req.url.includes('/s/') && !req.url.includes('/init/') && req.method === 'GET') {

            const qqwjHash = req.url.split('/s/')[1]
            const nextPhaseUrl = await getNextPhaseUrl(qqwjHash)

            const originWrite = res.write
            const originEnd = res.end

            // res.setHeader('content-encoding', 'gzip')
            // res.setHeader('content-type', 'text/html; charset=utf-8')

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
                console.log('log > got end')
                let fullChunk = Buffer.concat(buffers)
                zlib.unzip(fullChunk, {finishFlush: zlib.constants.Z_SYNC_FLUSH}, (err, buffer) => {
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

express.use(async (req: Request, res: Response, next: NextFunction) => {

    console.log(`${req.method}  ${req.url}`)

    if (!req.user) {
        return res.redirect('https://ancademy.org')
    }

    // 初始化
    if (req.url.includes('/init/qqwj/')) {
        const currentUserElfGameHash = req.query.token
        console.log('log > current Elf hash ....', currentUserElfGameHash)
        const currentPhaseId = req.url.split('/init/qqwj/')[1].slice(0, 24)
        try {
            const currentPhase: any = await ThirdPartPhase.findById(currentPhaseId)
            const currentPhaseParamsJson = JSON.parse(currentPhase.param)
            const currentPhaseqqwjHash = currentPhaseParamsJson.qqwjHash

            if (!currentPhase) {
                return res.redirect('https://ancademy.org')
            }

            console.log('log > find phase object...')
            console.log(currentPhase)

            const {playHashs} = currentPhase

            let redirectTo = null

            for (let i = 0; i < playHashs.length; i++) {
                if (playHashs[i].player.toString() === currentUserElfGameHash.toString()) {
                    redirectTo = `${settings.qqwjPhaseServerPrefix}/s/${currentPhaseqqwjHash}`
                }
            }

            if (redirectTo) {
                return res.redirect(redirectTo)
            }

            // 新加入成员
            playHashs.push({hash: currentPhaseqqwjHash, player: currentUserElfGameHash})
            currentPhase.playHashs = playHashs
            currentPhase.markModified('playHashs')
            await currentPhase.save()
            return res.redirect(`${settings.qqwjPhaseServerPrefix}/s/${currentPhaseqqwjHash}`)
        } catch (err) {
            if (err) {
                console.log(err)
                return res.redirect('https://ancademy.org')
            }
        }

        next()
    }

    if (req.url.includes('/s/') && !req.url.includes('init')) {
        req.headers = Object.assign(req.headers, {
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'zh-CN,zh;q=0.9',
            'origin': 'https://wj.qq.com',
            'referer': 'https://wj.qq.com/s/2831201/232f/'
        })
        next()
    }

    next()
})

express.use(errorHandler())
const server: any = express.listen(3073, () => {
    console.log('listening at ', server.address().port)
})

express.use(proxy)

serveRPC()