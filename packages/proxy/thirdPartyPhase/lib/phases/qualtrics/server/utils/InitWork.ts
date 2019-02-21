'use strict'

import {ThirdPartPhase} from "../../../../core/server/models"
import settings from "../../../../config/settings"

const {localQualtricsRootUrl} = settings

const InitWork = (app) => {
    app.use(async (req, res, next) => {

        console.info(`${req.method} ${req.url}`)

        const isUser = req.user
        const isGet = req.method === 'GET'
        const isInit = req.url.includes('/init')

        if (!isUser) return res.redirect('https://ancademy.org')

        if (isInit && isGet) {
            const currentUserElfGameHash = req.query.token
            console.log('log > Starting init.....')
            console.log('log > current Elf hash ....', currentUserElfGameHash)
            const currentPhaseId = req.url.split('/jfe/form/')[1].slice(0, 24)
            try {
                const currentPhase: any = await
                    ThirdPartPhase.findById(currentPhaseId)
                const currentPhaseParamsJson = JSON.parse(currentPhase.param)
                const currentPhaseSurveyId = currentPhaseParamsJson.qualtricsHash

                if (!currentPhase) return res.redirect('https://ancademy.org')

                console.log('log > find phase object...')
                console.log(currentPhase)

                const {playHashs} = currentPhase

                let redirectTo = null

                for (let i = 0; i < playHashs.length; i++) {
                    if (playHashs[i].player.toString() === currentUserElfGameHash.toString()) {
                        redirectTo = `${localQualtricsRootUrl}/jfe/form/${currentPhaseSurveyId}`
                    }
                }

                if (redirectTo) return res.redirect(redirectTo)

                playHashs.push({hash: currentPhaseSurveyId, player: currentUserElfGameHash})
                currentPhase.playHashs = playHashs
                currentPhase.markModified('playHashs')
                await currentPhase.save()
                return res.redirect(`${localQualtricsRootUrl}/jfe/form/${currentPhaseSurveyId}`)
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