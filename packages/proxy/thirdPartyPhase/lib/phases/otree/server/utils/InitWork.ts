'use strict'

import {ErrorPage} from '../../../common/utils'
import ListMap from '../utils/ListMap'
import {ThirdPartPhase} from '../../../../core/server/models'
import {elfSetting as settings} from 'elf-setting'

const {oTreeProxy} = settings

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
        const isInit = req.url.includes('/init')                  // 初始化的标志
        const isGetOtreeList = req.url.includes('/phases/list')   // 获取许可列表
        const otreeParticipantUrl = 'InitializeParticipant/'      // 初始化的标志

        if (isGetOtreeList) {
            const list = await ListMap.getList(`oTree-${settings.oTreeUser1}`)
            console.log(list)
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
                    const phaseParam = JSON.parse(Phase.param)
                    return okRes().redirect(phaseParam.adminUrl)
                }

                const findExistOne = Phase.playHash.filter(h => h.player === gameServicePlayerHash)
                if (findExistOne.length > 0) {
                    return okRes().redirect(`${oTreeProxy}/${otreeParticipantUrl}${findExistOne[0].hash}`)
                } else {
                    for (let ph of Phase.playHash) {
                        if (ph.player === 'wait') {
                            findHash = ph.hash
                            ph.player = gameServicePlayerHash
                            break
                        }
                    }
                    if (!findHash) {
                        return ErrorPage(okRes(), 'member full')
                    }
                    Phase.markModified('playHash')
                    await Phase.save()
                    return okRes().redirect(`${oTreeProxy}/${otreeParticipantUrl}${findHash}`)
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
