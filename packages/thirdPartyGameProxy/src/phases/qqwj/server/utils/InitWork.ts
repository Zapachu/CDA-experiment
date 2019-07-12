'use strict'

import {ThirdPartPhase} from '../../../../core/server/models'
import {elfSetting} from '@elf/setting'
import {sendErrorPage} from '../../../common/utils'
import {NextFunction, Request, Response} from 'express'
import {IActor} from '@elf/share'


const InitWork = (app) => {
    app.use(async (req: Request, res: Response, next: NextFunction) => {

        console.log(`${req.method}  ${req.url}`)

        if (!req.user) return sendErrorPage(res, 'Not Login')

        const isInit = req.url.includes('/init/qqwj/')
        const isMoPush = req.url.includes('/sur/mo_push')
        const isSubmit = req.url.includes('sur/collect_answer')

        if (isInit) {
            const actor:IActor = req.session.actor
            const currentPhaseId = req.url.split('/init/qqwj/')[1].slice(0, 24)
            try {

                const currentPhase: any = await ThirdPartPhase.findById(currentPhaseId)
                const currentPhaseParamsJson = JSON.parse(currentPhase.param)
                const currentPhaseQQWJHash = currentPhaseParamsJson.qqwjHash

                if (!currentPhase) return sendErrorPage(res, 'Phase Not Exist')

                req.session.qqwjPhaseId = currentPhase._id

                const {playHash} = currentPhase

                // Admin Url
                if (currentPhase.ownerToken.toString() === actor.token) {
                    const phaseParam = JSON.parse(currentPhase.param)
                    return res.redirect(phaseParam.adminUrl)
                }

                let redirectTo = null

                for (let i = 0; i < playHash.length; i++) {
                    if (playHash[i].player.toString() === actor.token) {
                        redirectTo = `${elfSetting.qqwjProxy}${currentPhaseQQWJHash}`
                    }
                }

                if (redirectTo) {
                    return res.redirect(redirectTo)
                }

                // 新加入成员
                playHash.push({hash: currentPhaseQQWJHash, player: actor.token})
                currentPhase.playHash = playHash
                currentPhase.markModified('playHash')
                await currentPhase.save()
                return res.redirect(`${elfSetting.qqwjProxy}${currentPhaseQQWJHash}`)
            } catch (err) {
                if (err) {
                    console.trace(err)
                    return sendErrorPage(res, 'Error')
                }
            }
            next()
        }

        if (!isMoPush) {
            req.headers = Object.assign({}, req.headers, {
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'zh-CN,zh;q=0.9',
                'origin': 'https://wj.qq.com',
                'referer': `https://wj.qq.com${req.url.split('wj.qq.com')[1]}`
            })
        }

        next()
    })
}

export {
    InitWork
}
