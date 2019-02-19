import settings from '../config/settings'
import {ThirdPartPhase} from '../models'

const otreePlayUrl = settings.otreeServerRootUrl
const otreeDemoUrlPrefix = `${otreePlayUrl}/demo/`
const otreeParticipantUrl = 'InitializeParticipant/'
const otreePhaseServerPrefix = settings.otreePhaseServerPrefix

declare interface IgetUrlByNamespace {
    err: number,
    phaseId: string,
    playUrl: string
}

/**
 * 截取otree Session 页中的链接
 *      1. 模拟点击 demo
 *      2. 生成 session页面， 获取 link hash
 *      3. 保存 控制台 url、prefix、玩家 otree hash
 *      4. 返回 otreePhase._id
 */
export const getUrlByNamespace = async (groupId: string, namespace: string, param: string): Promise<IgetUrlByNamespace> => {

    const request = require('request')
    const rp = require('request-promise')

    return new Promise<IgetUrlByNamespace>((resolve, reject) => {
        const playHashs = []
        const paramJson = JSON.parse(param)
        const otreeDemoClickUrl = `${otreeDemoUrlPrefix}${paramJson.otreeName}`
        request(otreeDemoClickUrl, async (error, response, body) => {
            if (error) {
                reject({err: 1, msg: 'err: make sure the otree server is starting'})
            }

            setTimeout(async () => {
                let content = body.split(otreeParticipantUrl)
                console.log(content)
                delete content[0]
                content.map(con => {
                    if (playHashs.indexOf(con.slice(0, 8)) == -1) {
                        playHashs.push(con.slice(0, 8))
                    }
                })

                const playHashsConf: { hash: string, player: string }[] = []

                // 预设玩家 hash， 皆为未分配
                playHashs.map(hash => {
                    playHashsConf.push({hash: hash, player: 'wait'})
                })

                const adminUrl = response.request.uri.path
                const newOtreePhase = await new ThirdPartPhase({
                    param: param,
                    groupId: groupId,
                    namespace: namespace,
                    playHashs: playHashsConf,
                    adminUrl: adminUrl,
                    prefixUrl: otreePlayUrl
                }).save()

                const phaseId = newOtreePhase._id.toString()
                console.log(`initialPlayUrl: ${otreePhaseServerPrefix}/init/${otreeParticipantUrl}${phaseId}`)

                resolve({
                    err: 0,
                    phaseId: newOtreePhase._id.toString(),
                    playUrl: `${otreePhaseServerPrefix}/init/${otreeParticipantUrl}${phaseId}`
                })
            }, 4000)
        })
    })
}

// 测试用
// getUrlByNamespace('2', 'otree', JSON.stringify({otreeName: 'public_goods',nextPhaseKey: 4}))