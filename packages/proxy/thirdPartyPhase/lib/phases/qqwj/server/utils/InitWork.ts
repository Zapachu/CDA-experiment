'use strict'

import {ThirdPartPhase} from "../../../../core/server/models"
import {elfSetting as settings} from 'elf-setting'
import {ErrorPage} from '../../../common/utils'
import {Request, Response, NextFunction} from 'express'

const InitWork = (app) => {
    app.use(async (req: Request, res: Response, next: NextFunction) => {

        console.log(`${req.method}  ${req.url}`)

        if (!req.user) return ErrorPage(res, "Not Login");

        const isInit = req.url.includes('/init/qqwj/')
        const isMoPush = req.url.includes('/sur/mo_push')

        if (isInit) {
            const currentUserElfGameHash = req.query.token
            const currentPhaseId = req.url.split('/init/qqwj/')[1].slice(0, 24)
            try {

                const currentPhase: any = await ThirdPartPhase.findById(currentPhaseId)
                const currentPhaseParamsJson = JSON.parse(currentPhase.param)
                const currentPhaseqqwjHash = currentPhaseParamsJson.qqwjHash

                if (!currentPhase) return ErrorPage(res, "Phase Not Exist")

                req.session.qqwjPhaseId = currentPhase._id

                const {playHash} = currentPhase

                // Admin Url
                if (currentPhase.ownerToken.toString() === currentUserElfGameHash.toString()) {
                    const phaseParam = JSON.parse(currentPhase.param)
                    return res.redirect(phaseParam.adminUrl)
                }

                let redirectTo = null

                for (let i = 0; i < playHash.length; i++) {
                    if (playHash[i].player.toString() === currentUserElfGameHash.toString()) {
                        redirectTo = `${settings.qqwjProxy}/s/${currentPhaseqqwjHash}`
                    }
                }

                if (redirectTo) {
                    return res.redirect(redirectTo)
                }

                // 新加入成员
                playHash.push({hash: currentPhaseqqwjHash, player: currentUserElfGameHash})
                currentPhase.playHash = playHash
                currentPhase.markModified('playHash')
                await currentPhase.save()
                return res.redirect(`${settings.qqwjProxy}/s/${currentPhaseqqwjHash}`)
            } catch (err) {
                if (err) {
                    console.trace(err)
                    return ErrorPage(res, "Error")
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
                'referer': `https://wj.qq.com/s/${req.url.split('/s/')[1]}`,
            })
        }

        next()
    })
}

export {
    InitWork
}
