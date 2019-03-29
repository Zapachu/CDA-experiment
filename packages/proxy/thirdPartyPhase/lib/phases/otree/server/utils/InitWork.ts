import {Request, Response, NextFunction} from 'express'
import {ErrorPage} from '../../../common/utils'
import ListMap from '../utils/ListMap'
import {ThirdPartPhase} from '../../../../core/server/models'
import {elfSetting as elfSetting} from 'elf-setting'
import {virtualJsRoute} from '../config'

const INIT_SIGN = '/init'
const START_SIGN = 'InitializeParticipant/'

const FETCH_DEMO_LIST = '/phases/list'
const FETCH_REPORT_SCREEN = '/report/screen'

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

        const isInit = req.url.includes(INIT_SIGN)
        const isFetchDemoList = req.url.includes(FETCH_DEMO_LIST)
        const isFetchReportScreen = req.url.includes(FETCH_REPORT_SCREEN)

        if (req.url.includes(virtualJsRoute)) {
            okRes()
            res.setHeader('Content-Type', 'text/javascript')
            return res.end(`window.registerOtreePhase("${elfSetting.oTreeNamespace}","${elfSetting.oTreeProxy}")`)
        }

        if (isFetchDemoList) {
            const list = await ListMap.getList(elfSetting.oTreeNamespace)
            return okRes().json({err: 0, list})
        }

        if (isFetchReportScreen) {
            const phaseId = req.session.oTreePhaseId
            const phase = await ThirdPartPhase.findById(phaseId)
            const gameServicePlayerHash = req.session.token
            const {winW, winH} = req.body
            for (let ph of phase.playHash) {
                if (ph.player === gameServicePlayerHash) {
                    ph.screen = JSON.stringify({winW, winH})
                    break
                }
            }
            return res.json({code: 0, msg: 'reported'})
        }

        if (isInit) {
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
                    if (!findHash) {
                        return ErrorPage(okRes(), 'member full')
                    }
                    phase.markModified('playHash')
                    await phase.save()
                    return okRes().redirect(`${elfSetting.oTreeProxy}/${START_SIGN}/${findHash}`)
                }
            } catch (err) {
                if (err) {
                    return ErrorPage(okRes(), err)
                }
            }
        }
        okRes()
        next()
    })
}
