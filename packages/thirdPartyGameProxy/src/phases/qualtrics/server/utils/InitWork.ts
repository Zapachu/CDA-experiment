'use strict'

import {ThirdPartPhase} from "../../../../core/server/models"
import {elfSetting} from '@elf/setting'
import {IActor} from '@elf/share'

const {qualtricsProxy} = elfSetting

const InitWork = (app) => {
    app.use(async (req, res, next) => {
        const actor:IActor = req.session.actor
        const isUser = req.user
        const isGet = req.method === 'GET'
        const isInit = req.url.includes('/init')

        if (!isUser) return res.redirect('https://ancademy.org')

        if (isInit && isGet) {
            console.log('log > Starting init.....')
            console.log('log > current Elf hash ....', actor.token)
            const currentPhaseId = req.url.split('/jfe/form/')[1].slice(0, 24)
            try {
                const currentPhase: any = await
                    ThirdPartPhase.findById(currentPhaseId)
                const currentPhaseParamsJson = JSON.parse(currentPhase.param)
                const currentPhaseSurveyId = currentPhaseParamsJson.qualtricsHash

                if (!currentPhase) return res.redirect('https://ancademy.org')

                console.log('log > find phase object...')
                console.log(currentPhase)

                req.session.qualtricsPhaseId = currentPhase._id

                // Admin Url
                if (currentPhase.ownerToken.toString() === actor.token) {
                    const phaseParam = JSON.parse(currentPhase.param)
                    return res.redirect(phaseParam.adminUrl)
                }

                const {playHash} = currentPhase

                let redirectTo = null

                for (let i = 0; i < playHash.length; i++) {
                    if (playHash[i].player.toString() === actor.token) {
                        redirectTo = `${qualtricsProxy}/jfe/form/${currentPhaseSurveyId}`
                    }
                }

                if (redirectTo) return res.redirect(redirectTo)

                playHash.push({hash: currentPhaseSurveyId, player: actor.token})
                currentPhase.playHash = playHash
                currentPhase.markModified('playHash')
                await currentPhase.save()
                return res.redirect(`${qualtricsProxy}/jfe/form/${currentPhaseSurveyId}`)
            } catch (err) {
                if (err) {
                    console.log(err)
                    return res.redirect('https://ancademy.org')
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
