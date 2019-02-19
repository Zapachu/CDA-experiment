import { resolve } from 'path'
import { loadPackageDefinition, credentials } from 'grpc'
import { loadSync } from '@grpc/proto-loader'
import setting from '../../../config/settings'
import { INewPhaseReq } from '../proto/phaseManager'
import { ThirdPartPhase } from '../../../models'
import settings from '../../../config/settings'
const { GameService, PhaseService } = loadPackageDefinition(loadSync(resolve(__dirname, '../proto/phaseManager.proto'))) as any

const {qualtricsPhaseServerPrefix, localQualtricsRootUrl} = settings

/**
 * 真实路由：  /jfe/form/Qualtrics_HASH
 * 初始化路由： /init/jfe/form/PHASE_ID?hash=ELFHASH
 * @param groupId 
 * @param namespace 
 * @param param 
 */

const getUrlByNamespace = async (groupId, namespace, param) => {
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

const phaseService = {
    async newPhase({ request: { groupId, namespace, param } }: { request: INewPhaseReq }, callback) {
        callback(null, { playUrl: await getUrlByNamespace(groupId, namespace, param) })
    }
}

export { PhaseService, phaseService }

const gameService = new GameService(setting.elfGameServiceUri, credentials.createInsecure())
export { gameService }