import { ThirdPartPhase } from '../../../../core/server/models'
import settings from '../../../../config/settings'
import {PhaseManager} from 'elf-protocol'

const {wjxProxy} = settings

/**
 * 真实路由：  https://www.wjx.cn/jq/HASH.aspx
 * 初始化路由： /init/jq/PHASEID?hash=ELFHASH
 * @param groupId
 * @param namespace
 * @param param
 */

const getUrlByNamespace = async (groupId, namespace, param) => {
    let paramJson = JSON.parse(param)
    const {wjxUrl: realWjxUrl} = paramJson
    paramJson.wjxHash = realWjxUrl.split('/jq/')[1]
    const paramString = JSON.stringify(paramJson)
    try {
        const newWjxPhase = await new ThirdPartPhase({
            playHash: [],
            groupId: groupId,
            param: paramString,
            namespace: namespace,
        }).save()
        return `${wjxProxy}/init/jq/${newWjxPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.log(err)
            return 'Error'
        }
    }
}

export const phaseService = {
    async newPhase({ request: { groupId, namespace, param } }: { request: PhaseManager.TNewPhaseReq }, callback:PhaseManager.TNewPhaseCallback) {
        callback(null, { playUrl: await getUrlByNamespace(groupId, namespace, param) })
    }
}
