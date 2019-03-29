import {Request, Response, NextFunction} from 'express'
import {ErrorPage} from '../../../common/utils'
import ListMap from '../utils/ListMap'
import {ThirdPartPhase} from '../../../../core/server/models'
import {elfSetting as elfSetting} from 'elf-setting'
import {virtualJsRoute, getOTreeListRoute, reportScreenRoute, jqueryRoute, initRoute} from '../config'
import * as path from "path"

const START_SIGN = 'InitializeParticipant'

export const InitWork = (app) => {
    app.use(async (req: Request, res: Response, next: NextFunction) => {
        const originWrite = res.write
        const originEnd = res.end

        const okRes = () => {
            res.write = originWrite
            res.end = originEnd
            return res
        }

        const noRes = () => {
            res.write = () => true
            res.end = () => null
        }

        noRes()

        if (req.url.includes(virtualJsRoute)) {
            okRes().setHeader('Content-Type', 'text/javascript')
            return okRes().end(`window.registerOtreePhase("${elfSetting.oTreeNamespace}","${elfSetting.oTreeProxy}")`)
        }

        if (req.url.includes(getOTreeListRoute)) {
            const list = await ListMap.getList(elfSetting.oTreeNamespace)
            return okRes().json({err: 0, list})
        }

        if (req.url.includes(reportScreenRoute)) {
            const phaseId = req.session.oTreePhaseId
            const phase = await ThirdPartPhase.findById(phaseId)
            const gameServicePlayerHash = req.session.token
            let jsonString = ''
            req.on('data', (data) => {
                jsonString += data
            })
            req.on('end', async () => {
                const body = JSON.parse(jsonString)
                for (let ph of phase.playHash) {
                    if (ph.player === gameServicePlayerHash) {
                        ph.screen = JSON.stringify({winW: body.winW, winH: body.winH})
                        break
                    }
                }
                phase.markModified('playHash')
                await phase.save()
                return okRes().json({code: 0, msg: 'reported'})
            })
        }

        if (req.url.includes(jqueryRoute)) {
            return okRes().sendFile(path.resolve(__dirname, './hack.js'))
        }

        if (req.url.includes(initRoute)) {
            let findHash: string
            const gameServicePlayerHash = req.session.token
            const phaseId = req.path.split(`${START_SIGN}/`)[1]

            try {
                const phase = await ThirdPartPhase.findById(phaseId).exec()

                if (!phase) {
                    return ErrorPage(okRes(), 'Phase Not Found')
                }

                req.session.oTreePhaseId = phase._id

                if (phase.ownerToken.toString() === gameServicePlayerHash.toString()) {
                    const phaseParam = JSON.parse(phase.param)
                    return okRes().redirect(phaseParam.adminUrl)
                }

                const findExistOne = phase.playHash.filter(h => h.player === gameServicePlayerHash)
                if (findExistOne.length > 0) {
                    return okRes().redirect(`${elfSetting.oTreeProxy}/${START_SIGN}/${findExistOne[0].hash}`)
                } else {
                    for (let ph of phase.playHash) {
                        if (ph.player === 'wait') {
                            findHash = ph.hash
                            ph.player = gameServicePlayerHash
                            break
                        }
                    }
                    if (!findHash) return ErrorPage(okRes(), 'member full')
                    phase.markModified('playHash')
                    await phase.save()
                    return okRes().redirect(`${elfSetting.oTreeProxy}/${START_SIGN}/${findHash}`)
                }
            } catch (err) {
                if (err) {
                    console.trace(err)
                    return ErrorPage(okRes(), err)
                }
            }
        }
        okRes()
        next()
    })
}
