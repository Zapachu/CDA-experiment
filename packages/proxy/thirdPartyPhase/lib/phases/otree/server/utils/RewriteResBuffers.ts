'use strict'


import {ErrorPage} from '../../../common/utils'
import {ThirdPartPhase} from "../../../../core/server/models"
import {gameService} from "../../../common/utils"
import {elfSetting as settings} from 'elf-setting'
import {Request, Response} from 'express'

const {oTreeProxy} = settings

const START_SIGN = 'InitializeParticipant'
const END_SIGN = 'OutOfRangeNotification'


export const rewriteResBuffers = async (proxyRes, req: Request, res: Response) => {

    if (!req.session.oTreePhaseId) return ErrorPage(res, 'Error In Rewrite Buffer')

    const isEnd = req.url.includes(END_SIGN)


    // if (isGet && isPlaying) {
    //     const originWrite = res.write
    //     const originEnd = res.end
    //     let gzipStream = Gzip()
    //     let buffers = []
    //     console.log('Hack Insert')
    //     console.log(req.url)
    //     res.write = (chunk) => {
    //         buffers.push(chunk)
    //         return true
    //     }
    //     console.log("Hack 2")
    //     res.end = () => {
    //         let fullChunk = Buffer.concat(buffers)
    //         console.log("Hack 3")
    //         zlib.unzip(fullChunk, {finishFlush: zlib.constants.Z_SYNC_FLUSH}, async (err, buffer) => {
    //             if (!err) {
    //                 console.log("Hack 4")
    //                 gzipStream.on('data', chunk => {
    //                     originWrite.call(res, chunk)
    //                     gzipStream.end()
    //                 })
    //                 console.log("Hack 5")
    //                 gzipStream.on('end', () => {
    //                     originEnd.call(res)
    //                 })
    //                 console.log("Hack 6")
    //                 const data = buffer.toString()
    //                 console.log("Hack 7")
    //                 console.log(data)
    //                 const dataStart = data.split('<head>')[0]
    //                 const dataEnd = data.split('<head>')[1]
    //                 const newData = dataStart + '<head>' + generateInsertScript() + dataEnd
    //                 console.log(newData)
    //                 gzipStream.write(new Buffer(newData))
    //             } else {
    //                 console.log("Hack false")
    //                 console.log(err)
    //             }
    //         })
    //     }
    // }

    if (isEnd) {
        const originWrite = res.write
        const originEnd = res.end

        const okRes = () => {
            res.write = originWrite
            res.end = originEnd
            return res
        }
        res.write = () => {
            return true
        }
        res.end = () => {
        }
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
                phasePlayer: {uniKey: playerOtreeHash}
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
