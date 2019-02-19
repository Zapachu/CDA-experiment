import {ThirdPartPhase} from '../models'
import settings from '../config/settings'

const {qqwjPhaseServerPrefix, localqqwjRootUrl} = settings

/**
 * 真实路由：  https://wj.qq.com/s/HASH
 * 初始化路由： /init/qqwj/PHASEID?hash=ELFHASH
 * @param groupId
 * @param namespace
 * @param param
 */

export const getUrlByNamespace = async (groupId, namespace, param) => {
    let paramJson = JSON.parse(param)
    const {qqwjUrl: realqqwjUrl} = paramJson
    const qqwjHash = realqqwjUrl.split('/s/')[1]
    paramJson.qqwjHash = qqwjHash
    const paramString = JSON.stringify(paramJson)

    try {
        const newqqwjPhase = await new ThirdPartPhase({
            playHashs: [],
            groupId: groupId,
            param: paramString,
            namespace: namespace,
            prefixUrl: qqwjPhaseServerPrefix
        }).save()
        return `${localqqwjRootUrl}/init/qqwj/${newqqwjPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.log(err)
            return 'Error'
        }
    }
}