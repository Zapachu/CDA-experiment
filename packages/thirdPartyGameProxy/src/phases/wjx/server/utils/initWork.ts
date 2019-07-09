'use strict'

import {ThirdPartPhase} from "../../../../core/server/models"
import {elfSetting as settings} from '@elf/setting'
import {getNextPhaseUrl} from './getNextPhaseUrl'
import {sendErrorPage} from '../../../common/utils'
import {Request} from 'express'
import {IActor} from '@elf/share'


const InitWork = (app) => {

    app.use(async (req:Request, res, next) => {

        const isGet = req.method === 'GET'
        const isPOST = req.method === 'POST'

        const isInit = req.url.includes('/init/jq/')
        const isDone = req.url.includes('/complete')
        const isSubmit = req.url.includes('/processjq')


        // if (!req.user) return ErrorPage(res, 'Not Login')

        if (isPOST && isSubmit) {
            delete req.query.sd
        }

        if (isGet && isDone) {
            const wjxHash = req.query.q
            const wjxPhaseId = req.session.wjxPhaseId
            const wjxJidx = req.query.jidx
            const nextPhaseUrl = await getNextPhaseUrl(wjxHash, wjxPhaseId, wjxJidx)
            return res.redirect(nextPhaseUrl)
        }

        if (isGet && isInit) {
            const actor:IActor = req.session.actor
            const currentPhaseId = req.url.split('/jq/')[1].slice(0, 24)
            try {
                const currentPhase: any = await ThirdPartPhase.findById(currentPhaseId)
                const currentPhaseParamsJson = JSON.parse(currentPhase.param)
                const currentPhaseWjxHash = currentPhaseParamsJson.wjxHash

                if (!currentPhase) return sendErrorPage(res, 'Phase Not Found')

                const {playHash} = currentPhase
                req.session.wjxPhaseId = currentPhase._id

                if (currentPhase.ownerToken.toString() === actor.token) {
                    const phaseParam = JSON.parse(currentPhase.param)
                    return res.redirect(phaseParam.adminUrl)
                }

                let redirectTo = null
                for (let i = 0; i < playHash.length; i++) {
                    if (playHash[i].player.toString() === actor.token) {
                        redirectTo = `${settings.wjxProxy}/jq/${currentPhaseWjxHash}.aspx`
                    }
                }

                if (redirectTo) return res.redirect(redirectTo)

                // 新加入成员
                playHash.push({hash: currentPhaseWjxHash, player: actor.token})
                currentPhase.playHash = playHash
                currentPhase.markModified('playHash')
                await currentPhase.save()
                return res.redirect(`${settings.wjxProxy}/jq/${currentPhaseWjxHash}.aspx`)
            } catch (err) {
                if (err) {
                    console.trace(err)
                    return sendErrorPage(res, 'Error in Init')
                }
            }
            next()
        }
        next()
    })
}

export {
    InitWork
}