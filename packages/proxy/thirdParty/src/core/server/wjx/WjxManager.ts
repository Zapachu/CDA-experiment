import {ThirdPartPhase} from '../models'
import settings from '../config/settings'

const {WjxPhaseServerPrefix, localWjxRootUrl} = settings

/**
 * 真实路由：  https://www.wjx.cn/jq/HASH.aspx
 * 初始化路由： /init/jq/PHASEID?hash=ELFHASH
 * @param groupId
 * @param namespace
 * @param param
 */

export const getUrlByNamespace = async (groupId, namespace, param) => {
    let paramJson = JSON.parse(param)
    const {wjxUrl: realWjxUrl} = paramJson
    const wjxHash = realWjxUrl.split('/jq/')[1]
    paramJson.wjxHash = wjxHash
    const paramString = JSON.stringify(paramJson)

    try {
        const newWjxPhase = await new ThirdPartPhase({
            playHashs: [],
            groupId: groupId,
            param: paramString,
            namespace: namespace,
            prefixUrl: WjxPhaseServerPrefix
        }).save()
        return `${localWjxRootUrl}/init/jq/${newWjxPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.log(err)
            return 'Error'
        }
    }
}