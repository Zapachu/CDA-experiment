import * as httpProxy from 'http-proxy'
import {ThirdPartPhase} from "../../../core/server/models"
import {sendErrorPage} from "../../common/utils"
import {configs} from '../config'
import {IActor} from '@elf/share'

const proxy = httpProxy.createProxyServer({toProxy: true})

/**
 * 注册：
 *      每个 OTree Server Docker 中同时运行这一个注册ELF心跳的服务器（RPC），告之ELF
 * 新建：
 *      从Docker中新建OTREE
 *      保存的Phase中 动态存储本Docker运行的端口及OTree端口
 *      新建完成
 * 运行:
 *      学生：
 *          学生点击后，根据 init 路由中的 port参数，设置 port 信息到 session中，运行实际地址，重定向到代理服务
 *          接收到重定向后，根据实际地址以及 session的port，代理到指定的 docker服务器
 *      老师：
 *          老师点击控制台后，根据session信息，重定向到指定服务器的后台控制面板
 */


export class Ctrl {
    static async proxyServer(req, res) {
        const {id: phaseId} = req.params
        const {host, port} = req.query


        // Custom Proxy
        req.session.otreeHost = host
        req.session.otreePort = port

        // recover router
        const actor:IActor = req.session.actor
        let findHash: string
        const phase = await ThirdPartPhase.findById(phaseId).exec()
        if (!phase) {
            return sendErrorPage(res, 'Phase Not Found')
        }
        req.session.oTreePhaseId = phase._id
        if (phase.ownerToken.toString() === actor.token.toString()) {
            const phaseParam = JSON.parse(phase.param)
            return res.redirect(phaseParam.adminUrl)
        }

        const findExistOne = phase.playHash.filter(h => h.player === actor.token)

        if (findExistOne.length > 0) {

            return res.redirect(`${configs.otreeProxyHost}:${configs.otreeProxyPort}/InitializeParticipant/${findExistOne[0].hash}`)

        } else {

            for (let ph of phase.playHash) {
                if (ph.player === 'wait') {
                    findHash = ph.hash
                    ph.player = actor.token
                    break
                }
            }

            if (!findHash) {
                return sendErrorPage(res, 'member full')
            }

            phase.markModified('playHash')
            await phase.save()
            return res.redirect(`${configs.otreeProxyHost}:${configs.otreeProxyPort}/InitializeParticipant/${findHash}`)
        }
    }

    static async proxyOther(req, res) {

        const otreeHost = req.session.otreeHost
        const otreePort = req.session.otreePort
        proxy.web(req, res, {target: `http://${otreeHost}:${otreePort}`})
    }
}


export * from './middleware'
