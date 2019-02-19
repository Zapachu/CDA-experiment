import { resolve } from 'path'
import { loadPackageDefinition, credentials } from 'grpc'
import { loadSync } from '@grpc/proto-loader'
import setting from '../../../config/settings'
import { INewPhaseReq } from '../proto/phaseManager'
import { ThirdPartPhase } from '../../../models'
import settings from '../../../config/settings'
const { GameService, PhaseService } = loadPackageDefinition(loadSync(resolve(__dirname, '../proto/phaseManager.proto'))) as any

const {WjxPhaseServerPrefix, localWjxRootUrl} = settings

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

const phaseService = {
    async newPhase({ request: { groupId, namespace, param } }: { request: INewPhaseReq }, callback) {
        callback(null, { playUrl: await getUrlByNamespace(groupId, namespace, param) })
    }
}

export { PhaseService, phaseService }

const gameService = new GameService(setting.elfGameServiceUri, credentials.createInsecure())
export { gameService }