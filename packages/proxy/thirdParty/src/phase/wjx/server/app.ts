import * as httpProxy from 'http-proxy-middleware'
import {Response, Request, NextFunction} from 'express'
import {serve as serveRPC} from './rpcService'
import {getGameService, settings, ThirdPartPhase, Server} from '@core/server'

const app = Server.start(3072, settings.WjxRootName)

const getNextPhaseUrl = async (wjxHash) => {
    console.log('log > wjx hash ', wjxHash)
    const wjxPhase: any = await ThirdPartPhase.findOne({
        namespace: 'wjx',
        playHashs: {$elemMatch: {hash: wjxHash}}
    })
    console.log('log > qualtrics phase', wjxPhase)
    const paramsJson = JSON.parse(wjxPhase.param)
    const request = {
        groupId: wjxPhase.groupId,
        nextPhaseKey: paramsJson.nextPhaseKey || -1,
        playerToken: paramsJson.palyerCode || wjxPhase.playHashs[0].player,
        playUrl: `${settings.WjxPhaseServerPrefix}/init/jq/${wjxPhase._id.toString()}`
    }

    return await new Promise((resolve, reject) => {
        getGameService().sendBackPlayer(request, (err: {}, service_res: { sendBackUrl: string }) => {
            if (err) {
                console.log(err)
            }
            console.log('log > service_res', service_res)
            const nextPhaseUrl = service_res.sendBackUrl
            resolve(nextPhaseUrl)
        })
    })
}

const proxy = httpProxy({
    target: settings.WjxServerRootUrl,
    ws: true,
    changeOrigin: true,
    autoRewrite: true,
    protocolRewrite: 'http'
})

app.use(async (req: Request, res: Response, next: NextFunction) => {

    if (!req.user) {
        return res.redirect('https://ancademy.org')
    }

    // 用户访问问卷星
    if (req.path.indexOf('/init/jq/') !== -1 && req.method === 'GET') {
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

            const {playHashs} = currentPhase

            let redirectTo = null

            for (let i = 0; i < playHashs.length; i++) {
                if (playHashs[i].player.toString() === currentUserElfGameHash.toString()) {
                    redirectTo = `${settings.WjxPhaseServerPrefix}/jq/${currentPhaseWjxHash}.aspx`
                }
            }

            if (redirectTo) {
                return res.redirect(redirectTo)
            }

            // 新加入成员
            playHashs.push({hash: currentPhaseWjxHash, player: currentUserElfGameHash})
            currentPhase.playHashs = playHashs
            currentPhase.markModified('playHashs')
            await currentPhase.save()
            return res.redirect(`${settings.WjxPhaseServerPrefix}/jq/${currentPhaseWjxHash}`)
        } catch (err) {
            if (err) {
                console.log(err)
                return res.redirect('https://ancademy.org')
            }
        }

        next()
    }

    if (req.path.indexOf('complete') !== -1 && req.method === 'GET') {
        const wjxHash = req.query.q
        const nextPhaseUrl: any = getNextPhaseUrl(wjxHash)
        return res.redirect(nextPhaseUrl)
    }

    next()
})
app.use(proxy)

serveRPC()