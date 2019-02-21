import * as objectHash from 'object-hash'
import settings from '../../../../../config/settings'
import { ThirdPartPhase } from '../../../../../core/server/models'

const otreePlayUrl = settings.otreeServerRootUrl
const otreeDemoUrlPrefix = `${otreePlayUrl}/demo/`
const otreeParticipantUrl = 'InitializeParticipant/'
const localOtreeRootUrl = settings.localOtreeRootUrl

declare interface IgetUrlByNamespace {
    err: number,
    phaseId: string,
    playUrl: string
}

const gen32Token = (source) => {
    return objectHash(source, {algorithm: 'md5'})
}

/**
 * 截取otree Session 页中的链接
 *      1. 模拟点击 demo
 *      2. 生成 session页面， 获取 link hash
 *      3. 保存 控制台 url、prefix、玩家 otree hash
 *      4. 返回 otreePhase._id
 */
const getUrlByNamespace = async (groupId: string, namespace: string, param: string, owner: string): Promise<IgetUrlByNamespace> => {

    const rp = require('request-promise')

    return new Promise<IgetUrlByNamespace>((resolve, reject) => {
        const playHashs = []
        const paramJson = JSON.parse(param)
        const ownerToken = gen32Token(owner.toString())
        const otreeDemoClickUrl = `${otreeDemoUrlPrefix}${paramJson.otreeName}`

        function hackReq () {
            console.log('req')
            const options = {
                method: 'GET',
                uri: otreeDemoClickUrl,
                resolveWithFullResponse: true
            }
            rp(options).then(async res => {
                let body = res.body
                let content = body.split(otreeParticipantUrl)
                delete content[0]
                content.map(con => {
                    if (playHashs.indexOf(con.slice(0, 8)) == -1) {
                        playHashs.push(con.slice(0, 8))
                    }
                })
                const playHashsConf: { hash: string, player: string }[] = []
                // 预设玩家 hash， 皆为未分配
                playHashs.map(hash => { playHashsConf.push({ hash: hash, player: 'wait' }) })
                const adminUrl = res.request.uri.path
                const newOtreePhase = await new ThirdPartPhase({
                    param: param,
                    groupId: groupId,
                    namespace: namespace,
                    playHashs: playHashsConf,
                    adminUrl: adminUrl,
                    prefixUrl: otreePlayUrl,
                    ownerToken: ownerToken,
                }).save()

                const phaseId = newOtreePhase._id.toString()
                console.log(`initialPlayUrl: ${localOtreeRootUrl}/init/${otreeParticipantUrl}${phaseId}`)

                resolve({
                    err: 0,
                    phaseId: newOtreePhase._id.toString(),
                    playUrl: `${localOtreeRootUrl}/init/${otreeParticipantUrl}${phaseId}`
                })
            }).catch(err => {
                console.log(err)
            })
        }

        hackReq()
    })
}

export { getUrlByNamespace }
