'use strict'


const {Gzip} = require('zlib')
import * as zlib from "zlib"
import {ThirdPartPhase} from "../../../../core/server/models"
import {generateInsertScript} from './generateInsertScript'
import {gameService} from "../../../common/utils"
import {elfSetting as settings} from 'elf-setting'
const {oTreeProxy} = settings

const GET_METHOD = 'GET'
const START_SIGN = 'InitializeParticipant'
const END_SIGN = 'OutOfRangeNotification'


export const rewriteResBuffers = async (proxyRes, req, res) => {

    const isGet = req.method === GET_METHOD
    const isEnd = req.url.includes(END_SIGN)
    const isStart = req.url.includes(START_SIGN)

    if (isGet && isStart) {
        console.log(req.session.oTreePhaseId)
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
                    const newData = dataStart + '<head>' + generateInsertScript() + dataEnd
                    const removeSafePart = newData.replace('<script src="//js.aq.qq.com/js/aq_common.js"></script>', '')
                    gzipStream.write(new Buffer(removeSafePart))
                } else {
                    console.log(err)
                }
            })
        }
    }

    if (isEnd) {
        const originWrite = res.write
        const originEnd = res.end

        const okRes = () => {
            res.write = originWrite
            res.end = originEnd
            return res
        }
        res.write = () => {}
        res.end = () => {}
        let playerGameHash: string
        const playerOtreeHash: string = req.headers.referer.split('/p/')[1].split('/')[0]
        try {
            const otreePhase: any = await ThirdPartPhase.findOne({
                // namespace: 'otree',
                playHash: {$elemMatch: {hash: playerOtreeHash}}
            }).exec()
            console.log('phase', otreePhase)
            otreePhase.playHash.map(op => {
                if (op.hash.toString() === playerOtreeHash.toString()) {
                    playerGameHash = op.player.toString()
                }
            })
            const params: { nextPhaseKey: string } = JSON.parse(otreePhase.param)
            const groupId: string = otreePhase.groupId
            const playUrl: string = `${oTreeProxy}/init/${START_SIGN}/${otreePhase._id}`
            const playerToken: string = playerGameHash
            const nextPhaseKey: string = params.nextPhaseKey
            gameService.sendBackPlayer({
                groupId, playUrl, playerToken, nextPhaseKey,
                phasePlayer:{uniKey:playerOtreeHash}
            }, (err: {}, service_res: { sendBackUrl: string }) => {
                if (err) {
                    console.log(err)
                    return okRes().send('Get Next Phase Error From Core')
                }
                console.log(service_res.sendBackUrl)
                const nextPhaseUrl = service_res.sendBackUrl
                return okRes().redirect(nextPhaseUrl)
            })
        } catch (err) {
            if (err) {
                console.log(err)
                return okRes().send(err)
            }
        }
    }
}
