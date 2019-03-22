'use strict'

import {ThirdPartPhase} from "../../../../core/server/models"
import {elfSetting as settings} from 'elf-setting'

const InitWork = (app) => {
    app.use(async (req, res, next) => {

        console.log(`${req.method}  ${req.url}`)

        if (!req.user) return res.redirect('https://ancademy.org')

        const isInit = req.url.includes('/init/qqwj/')
        const isMoPush = req.url.includes('/sur/mo_push')

        if (isInit) {
            const currentUserElfGameHash = req.query.token
            console.log('log > current Elf hash ....', currentUserElfGameHash)
            const currentPhaseId = req.url.split('/init/qqwj/')[1].slice(0, 24)
            try {
                const currentPhase: any = await ThirdPartPhase.findById(currentPhaseId)
                const currentPhaseParamsJson = JSON.parse(currentPhase.param)
                const currentPhaseqqwjHash = currentPhaseParamsJson.qqwjHash

                if (!currentPhase) {
                    return res.redirect('https://ancademy.org')
                }

                console.log('log > find phase object...')
                console.log(currentPhase)

                const {playHash} = currentPhase

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
                    console.log(err)
                    return res.redirect('https://ancademy.org')
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
