'use strict'

import {ErrorPage} from '../../../common/utils/errorPage'
import ListMap from '../utils/ListMap'
import {ThirdPartPhase} from '../../../../core/server/models'
import settings from '../../../../config/settings'

const {localOtreeRootUrl} = settings

const InitWork = (app) => {
    app.use(async (req, res, next) => {
        console.log(req.url)
        const originWrite = res.write
        const originEnd = res.end

        const okRes = () => {
            res.write = originWrite
            res.end = originEnd
            return res
        }

        const noRes = () => {
            res.write = () => {
            }
            res.end = () => {
            }
        }

        noRes()
        console.log(`${req.method}  ${req.url}`)
        // console.log(req.user)
        // if (!req.user) return ErrorPage(okRes(), 'Not Login')
        const isInit = req.url.includes('/init')                  // 初始化的标志
        const isGetOtreeList = req.url.includes('/phases/list')   // 获取许可列表
        const otreeParticipantUrl = 'InitializeParticipant/'      // 初始化的标志

        if (isGetOtreeList) {
            const list = ListMap.getList(settings.otreeUser1)
            return okRes().json({err: 0, list})
        }

        if (isInit) {
            let findHash: string
            const gameServicePlayerHash = req.session.token
            const phaseId = req.path.split('InitializeParticipant/')[1]

            try {
                const Phase: any = await ThirdPartPhase.findById(phaseId).exec()

                if (!Phase) {
                    return ErrorPage(okRes(), 'phase not found')
                }

                if (Phase.ownerToken.toString() === gameServicePlayerHash.toString()) {
                    return okRes().redirect(Phase.adminUrl)
                }

                const findExistOne = Phase.playHashs.filter(h => h.player === gameServicePlayerHash)
                if (findExistOne.length > 0) {
                    return okRes().redirect(`${localOtreeRootUrl}/${otreeParticipantUrl}${findExistOne[0].hash}`)
                } else {
                    for (let ph of Phase.playHashs) {
                        if (ph.player === 'wait') {
                            findHash = ph.hash
                            ph.player = gameServicePlayerHash
                            break
                        }
                    }
                    if (!findHash) {
                        return ErrorPage(okRes(), 'member full')
                    }
                    Phase.markModified('playHashs')
                    await Phase.save()
                    return okRes().redirect(`${localOtreeRootUrl}/${otreeParticipantUrl}${findHash}`)
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

export {
    InitWork
}
