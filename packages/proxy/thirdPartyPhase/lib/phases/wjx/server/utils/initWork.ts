'use strict'

import {ThirdPartPhase} from "../../../../core/server/models"
import settings from "../../../../config/settings"
import {getNextPhaseUrl} from './getNextPhaseUrl'

const InitWork = (app) => {

    app.use(async (req, res, next) => {

        const isGet = req.method === 'GET'
        const isInit = req.url.includes('/init/jq/')
        const isDone = req.url.includes('/complete')


        if (!req.user) return res.redirect('https://ancademy.org')

        if (isGet && isDone) {
            const wjxHash = req.query.q
            const nextPhaseUrl = await getNextPhaseUrl(wjxHash)
            return res.redirect(nextPhaseUrl)
        }

        if (isGet && isInit) {
            console.log('log > Starting init.....')
            const currentUserElfGameHash = req.query.token
            console.log('log > current Elf hash ....', currentUserElfGameHash)
            const currentPhaseId = req.url.split('/jq/')[1].slice(0, 24)
            try {
                const currentPhase: any = await ThirdPartPhase.findById(currentPhaseId)
                const currentPhaseParamsJson = JSON.parse(currentPhase.param)
                const currentPhaseWjxHash = currentPhaseParamsJson.wjxHash

                if (!currentPhase) {
                    return res.redirect('https://ancademy.org')
                }

                console.log('log > find phase object...')
                console.log(currentPhase)

                const {playHash} = currentPhase

                let redirectTo = null

                for (let i = 0; i < playHash.length; i++) {
                    if (playHash[i].player.toString() === currentUserElfGameHash.toString()) {
                        redirectTo = `${settings.wjxProxy}/jq/${currentPhaseWjxHash}.aspx`
                    }
                }

                if (redirectTo) {
                    return res.redirect(redirectTo)
                }

                // 新加入成员
                playHash.push({hash: currentPhaseWjxHash, player: currentUserElfGameHash})
                currentPhase.playHash = playHash
                currentPhase.markModified('playHash')
                await currentPhase.save()
                return res.redirect(`${settings.wjxProxy}/jq/${currentPhaseWjxHash}`)
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
