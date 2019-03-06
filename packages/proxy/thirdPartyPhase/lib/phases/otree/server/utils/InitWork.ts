'use strict'

import {ErrorPage} from '../../../common/utils/errorPage'
import {Model} from 'elf-protocol'
import {ThirdPartPhase} from '../../../../core/server/models'
import settings from '../../../../config/settings'
import {list as otreeDemoList} from './otreeList'

const {localOtreeRootUrl} = settings

const InitWork = (app) => {
    app.use(async (req, res, next) => {
        const originWrite = res.write
        const originEnd = res.end

        const okRes = () => {
            res.write = originWrite
            res.end = originEnd
            return res
        }

        const noRes = () => {
            res.write = () => {}
            res.end = () => {}
        }

        noRes()
        console.log(`${req.method}  ${req.url}`)
        console.log(req.user)
        if (!req.user) return ErrorPage(okRes(), 'Not Login')
        const isInit = req.url.includes('/init')                  // 初始化的标志
        const isGetOtreeList = req.url.includes('/phases/list')   // 获取许可列表
        const otreeParticipantUrl = 'InitializeParticipant/'      // 初始化的标志

        /**
         * Change:
         * proxy: run
         *   oTree server 权限
         *      all list
         *   oTree server run
         *      1.Get Game List
         *          1.run demo list page √
         *            get page, get list, send list
         *          2.read oTree settings file ×
         *      2.Get multi Proxy Server
         *          1.each proxy: namespace/elf item
         *          2.elf show proxy list
         *          3.run in proxy
         */
        if (isGetOtreeList) {
            let permittedList = ['quiz']
            try {
                const userGamePermissions: any = await Model.GameUserPermissionModel.find({userId: req.user._id.toString()}).populate('gameTemplateId')
                console.log(userGamePermissions)
                userGamePermissions.forEach(rec => {
                    if (rec.gameTemplateId.namespace === 'otree_demo') {
                        permittedList = otreeDemoList
                    }
                })
                return okRes().json({err: 0, list: permittedList})
            } catch (err) {
                if (err) {
                    return okRes().json({err: 1, msg: err})
                }
            }
        }

        if (isInit) {
            let findHash: string
            const gameServicePlayerHash = req.session.token
            const phaseId = req.path.split('InitializeParticipant/')[1]

            try {
                const Phase:any = await ThirdPartPhase.findById(phaseId).exec()

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
