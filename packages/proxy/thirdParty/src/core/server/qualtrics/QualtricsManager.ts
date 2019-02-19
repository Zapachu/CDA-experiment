import {ThirdPartPhase} from '../models'
import settings from '../config/settings'

const {qualtricsPhaseServerPrefix, localQualtricsRootUrl} = settings

/**
 * 真实路由：  /jfe/form/Qualtrics_HASH
 * 初始化路由： /init/jfe/form/PHASE_ID?hash=ELFHASH
 * @param groupId
 * @param namespace
 * @param param
 */
export const getUrlByNamespace = async (groupId, namespace, param) => {
    let paramJson = JSON.parse(param)
    const {qualtricsUrl: realQualtricsUrl} = paramJson
    const qualtricsHash = realQualtricsUrl.split('/jfe/form/')[1]
    paramJson.qualtricsHash = qualtricsHash
    const paramString = JSON.stringify(paramJson)

    try {
        const newQualtricsPhase = await new ThirdPartPhase({
            playHashs: [],
            groupId: groupId,
            param: paramString,
            namespace: namespace,
            prefixUrl: qualtricsPhaseServerPrefix
        }).save()
        return `${localQualtricsRootUrl}/init/jfe/form/${newQualtricsPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.log(err)
            return 'Error'
        }
    }
}